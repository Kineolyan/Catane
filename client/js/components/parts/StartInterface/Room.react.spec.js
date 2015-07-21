import tests from 'client/js/components/libs/test';

import React from 'react/addons';

import Room from 'client/js/components/parts/StartInterface/Room.react';
import { PlayersBinding } from 'client/js/components/common/players';

var utils = React.addons.TestUtils;

describe('A room', function() {

	beforeEach(function() {
		this._ctx = tests.getCtx();
		this.room = tests.bootstrap(this._ctx, Room);

		this.setPlayers = function(players) {
			var binding = this._ctx.getBinding();
			var helper = PlayersBinding.from(binding);
			helper.deleteAll();
			players.forEach(player => helper.setPlayer(...player));
			helper.save(binding);
		};
	});

	describe('should display', function() {
		it('#2 players', function(done) {
			this.setPlayers([
				[1, 'bob', 'green'],
				[2, 'tom', 'yellow']
			]);

			setTimeout(() => {
				expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'player-elem')).toHaveLength(2);
				done();
			}, 100);
		});

		it('#3 players', function(done) {
			this.setPlayers([
				[1, 'bob', 'green'],
				[2, 'tom', 'yellow'],
				[3, 'lolo', 'blue']
			]);

			setTimeout(() => {
				expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'player-elem').length).toBe(3);
				done();
			}, 100);
		});

	});

	it('shouldn\'t render start button when there are less than 2 players', function() {
		expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'start').length).toBe(0);
	});

	it('should render the button with more than 2 players', function(done) {
		this.setPlayers([
			[1, 'bob', 'green'],
			[2, 'tom', 'yellow'],
			[3, 'mailis', 'blue']
		]);

		setTimeout(() => {
			expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'start').length).toBe(1);
			done();
		}, 200);
	});


});