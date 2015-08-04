import 'client/js/components/libs/test';

import tests from 'client/js/components/libs/test';

import { Group } from 'react-art';
import Circle from 'react-art/shapes/circle';

import { BoardBinding } from 'client/js/components/common/map';
import City from 'client/js/components/parts/GameInterface/Map/City.react';

fdescribe('<City>', function() {
	beforeEach(function() {
		var city = BoardBinding.buildCity({ x: 10, y: 10 });
		var ctx = tests.getCtx(city);
		this.element = tests.bootstrap(ctx, City);
	});

	it('creates an simple circle', function() {
		var circles = tests.getRenderedElements(this.element, Circle);
		expect(circles).toHaveLength(1);
	});

	it('places the city correctly', function() {
		var group = tests.getRenderedElements(this.element, Group)[0];
		var coordinates = { x: group.props.x, y: group.props.y };
		// city (15, 8.7) * 60
		expect(coordinates).toEqual({ x: 900, y: 522 });
	});

	it('has no click action', function() {
		var group = tests.getRenderedElements(this.element, Group)[0];
		expect(group.props).not.toHaveKey('onClick');
	});
});