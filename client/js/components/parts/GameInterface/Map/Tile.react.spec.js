import tests from 'client/js/components/libs/test';

import { BoardBinding } from 'client/js/components/common/map';
import { Board } from 'client/js/components/libs/globals';

import { Text, Shape, Group } from 'react-art';

import Tile from 'client/js/components/parts/GameInterface/Map/Tile.react';

describe('<Tile>', function() {
	beforeEach(function() {
		var tile = BoardBinding.buildTile({ x: 10, y: 10, resource: 'tuile', diceValue: 1 });
		var ctx = tests.getCtx(tile);
		this.element = tests.bootstrap(ctx, Tile);
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
		var group = tests.getRenderedElements(this.element, Group)[0];
		var coordinates = { x: group.props.x, y: group.props.y };
		// city (15, 8.7) * 60
		expect(coordinates).toEqual({ x: 900, y: 522 });
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
	});

});
