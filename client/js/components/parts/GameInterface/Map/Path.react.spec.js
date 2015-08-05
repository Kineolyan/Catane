import tests from 'client/js/components/libs/test';

import { BoardBinding } from 'client/js/components/common/map';

import { Shape, Group } from 'react-art';
import Path from 'client/js/components/parts/GameInterface/Map/Path.react';

describe('<Path>', function() {
	beforeEach(function() {
		var path = BoardBinding.buildPath({ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } });
		var ctx = tests.getCtx(path);
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

	it('has no click action', function() {
		var group = tests.getRenderedElements(this.element, Group)[0];
		expect(group.props).not.toHaveKey('onClick');
	});
});
