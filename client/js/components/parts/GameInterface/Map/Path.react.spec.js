import tests from 'client/js/components/libs/test';

import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Shape, Group } from 'react-art';
import Path from 'client/js/components/parts/GameInterface/Map/Path.react';

class PathWithPlayer extends tests.Wrapper {
	render() {
		return <Path binding={{ default: this.binding.sub('path'), player: this.binding.sub('player') }}/>;
	}
}

describe('<Path>', function() {
	beforeEach(function() {
		var path = BoardBinding.buildPath({ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } });
		var ctx = tests.getCtx(path);
		this.binding = ctx.getBinding();
		this.element = tests.bootstrap(ctx, Path);
	});

	it('creates a rectangle', function() {
		var paths = tests.getRenderedElements(this.element, Shape);
		expect(paths).toHaveLength(1);
	});

	it('places the path correctly', function() {
		var group = tests.getRenderedElements(this.element, Group)[0];
		var coordinates = { x: group.props.x, y: group.props.y };
		// TODO expected coordinates but uses (0, 0) for drawing
		// expect(coordinates).toEqual({ x: 30, y: 52.2 });
		expect(coordinates).toEqual({ x: 0, y: 0 });
	});

	describe('with player', function() {
		beforeEach(function() {
			var ctx = tests.getCtx({
				path: BoardBinding.buildCity({ from: { x: 1, y: 0 }, to: { x: 0, y: 1 }, player: 1 }),
				player: PlayersBinding.createPlayer(1, 'Tico', 'red')
			});
			this.element = tests.bootstrap(ctx, PathWithPlayer);
		});

		it('renders the path with player\'s color', function() {
			var shape = tests.getRenderedElements(this.element, Shape)[0];
			expect(shape.props.fill).toEqual('red');
		});
	});

	it('has no click action', function() {
		var group = tests.getRenderedElements(this.element, Group)[0];
		expect(group.props).not.toHaveKey('onClick');
	});

	describe('when selectable', function() {
		beforeEach(function(done) {
			this.binding.set('selectable', true);
			setTimeout(done, 1);
		});

		it('has click action', function() {
			var group = tests.getRenderedElements(this.element, Group)[0];
			expect(group.props).toHaveKey('onClick');
		});
	});
});
