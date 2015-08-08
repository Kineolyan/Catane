import 'client/js/components/libs/test';

import tests from 'client/js/components/libs/test';
import { Channel } from 'client/js/components/libs/socket';

import React from 'react';
import { Group } from 'react-art';
import Circle from 'react-art/shapes/circle';

import { PlayersBinding } from 'client/js/components/common/players';
import { BoardBinding } from 'client/js/components/common/map';
import City from 'client/js/components/parts/GameInterface/Map/City.react';

const util = React.addons.TestUtils;

class CityWithPlayer extends tests.Wrapper {
	render() {
		return <City binding={{ default: this.binding.sub('city'), player: this.binding.sub('player') }}/>;
	}
}

describe('<City>', function() {
	beforeEach(function() {
		var city = BoardBinding.buildCity({ x: 10, y: 10 });
		var ctx = tests.getCtx(city);
		this.binding = ctx.getBinding();
		this.socket = tests.createServer(ctx);
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

	describe('with player', function() {
		beforeEach(function() {
			var ctx = tests.getCtx({
				city: BoardBinding.buildCity({ x: 10, y: 10, player: 1 }),
				player: PlayersBinding.createPlayer(1, 'Tico', 'red')
			});
			this.element = tests.bootstrap(ctx, CityWithPlayer);
		});

		it('renders the city with player\'s color', function() {
			var circle = tests.getRenderedElements(this.element, Circle)[0];
			expect(circle.props.fill).toEqual('red');
		});
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

		xit('sends the colony coordinates on click', function() {
			expect(() => {
				util.Simulate.click(this.group);
			}).toChangeBy(() => this.socket.messages(Channel.playPickColony).length, 1);

			var message = this.socket.lastMessage(Channel.playPickColony);
			expect(message).toEqual({ colony: { x: 10, y: 10 } });
		});
	});
});