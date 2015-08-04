import tests from 'client/js/components/libs/test';

import { BoardBinding } from 'client/js/components/common/map';
import { Board } from 'client/js/components/libs/globals';

import React from 'react/addons';
import { Shape, Group } from 'react-art';

import Path from 'client/js/components/parts/GameInterface/Map/Path.react';

var utils = React.addons.TestUtils;

fdescribe('<Path>', function() {
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
		// city (15, 8.7) * 60
		expect(coordinates).toEqual({ x: 30, y: 52.2 });
	});

	it('has no click action', function() {
		var group = tests.getRenderedElements(this.element, Group)[0];
		expect(group.props).not.toHaveKey('onClick');
	});
});
