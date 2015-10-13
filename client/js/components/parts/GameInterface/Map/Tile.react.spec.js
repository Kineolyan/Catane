import tests from 'client/js/components/libs/test';

import { BoardBinding } from 'client/js/components/common/map';
import { Board } from 'client/js/components/libs/globals';
import { gameManager } from 'client/js/components/listener/listener';

import { Text, Shape, Group } from 'react-art';
import Circle from 'react-art/shapes/circle';

import Tile from 'client/js/components/parts/GameInterface/Map/Tile.react';

describe('<Tile>', function() {
	beforeEach(function() {
		var tile = BoardBinding.buildTile({ x: 10, y: 10, resource: 'tuile', diceValue: 1 });
		this.ctx = tests.getCtx(tile);
		this.element = tests.bootstrap(this.ctx, Tile);
		this.root = function() {
			return tests.getRenderedElements(this.element, Group)[0];
		};
	});

	it('represents the value of the dice', function() {
		var content = tests.getRenderedElements(this.element, Text);
		expect(content).toHaveLength(1);

		// It is important for rendering to have a string
		expect(content[0].props.children).toEqual('1');
	});

	it('should have the correct color', function() {
		var shape = tests.getRenderedElements(this.element, Shape)[0];
		expect(shape.props.fill).toEqual(Board.resources.tuile);
	});

	it('places the city correctly', function() {
		var group = this.root();
		var coordinates = { x: group.props.x, y: group.props.y };
		// city (15, 8.7) * 60
		expect(coordinates).toEqual({ x: 900, y: 522 });
	});

	describe('with thieves', function() {
		beforeEach(function(done) {
			this.ctx.getBinding().atomically()
				.set('thieves', true)
				.set('selectable', true)
				.commit();
			setTimeout(done, 100);
		});

		it('cannot be selected', function() {
			var group = this.root();
			expect(group.props).not.toHaveKey('onClick');
		});

		it('changes the color of dice background', function() {
			var diceBg = tests.getRenderedElements(this.element, Circle)[0];
			expect(diceBg.props.fill).toMatch(/#4a4a4a/i);
		});

		it('changes the color of the dice value', function() {
			var diceValue = tests.getRenderedElements(this.element, Text)[0];
			expect(diceValue.props.fill).toMatch(/#e0e0e0/i);
		});
	});

	describe('for desert', function() {
		beforeEach(function() {
			var tile = BoardBinding.buildTile({ x: 10, y: 10, resource: 'desert' });
			var ctx = tests.getCtx(tile);
			this.desertTile = tests.bootstrap(ctx, Tile);
		});

		it('does not diplay dice value', function() {
			var content = tests.getRenderedElements(this.desertTile, Text);
			expect(content).toBeEmpty();
		});

		it('display a circle to indicate the thieves', function(done) {
			this.ctx.getBinding().set('thieves', true);
			setTimeout(() => {
				var circles = tests.getRenderedElements(this.element, Circle);
				expect(circles).toHaveLength(1);
				done();
			}, 100);
		});
	});

	it('can be selected', function(done) {
		this.ctx.getBinding().set('selectable', true);
		setTimeout(() => {
			var group = this.root();
			expect(group.props).toHaveKey('onClick');
			done();
		}, 100);
	});

	describe('when selectable', function() {
		beforeEach(function(done) {
			this.ctx.getBinding().set('selectable', true);
			setTimeout(done, 100);
			this.socket = tests.createServer(this.ctx);
			this.mgr = gameManager();
			spyOn(this.mgr, 'selectTile');
		});

		it('calls #selectTile', function() {
			tests.simulateClick(this.root());
			expect(this.mgr.selectTile).toHaveBeenCalledWith({ x: 10, y: 10 });
		});
	});

});
