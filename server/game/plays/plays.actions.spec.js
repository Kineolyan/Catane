import * as starter from 'server/game/games/game-spec.starter';
import _ from 'lodash';
import Location from 'server/elements/geo/location';
import Path from 'server/elements/geo/path';

describe('Play actions', function() {
	beforeEach(function () {
		this.env = starter.createLocalGame(2);
		this.env.start();
		this.env.randomPick();
		this.p = this.env.players[0];
		this.other = this.env.players[1];
		this.env.rollDice(this.p);
	});

	describe('->play:add:road', function () {
		describe('with proper resources', function () {
			beforeEach(function () {
				// Give enough resources to the player
				this.env.setPlayerResources(this.p, { bois: 1, tuile: 1, mouton: 1 });
				this.path = new Path(new Location(0, 2), new Location(-1, 3));
				this.p.client.receive('play:add:road', { path: this.path.toJson() });
			});

			it('allows acquiring the road', function () {
				const message = this.p.client.lastMessage('play:add:road');
				expect(message._success).toBe(true);
			});

			it('notifies the player of its new resources', function () {
				const message = this.p.client.lastMessage('play:add:road');
				const resources = _.pick(message.resources, value => value !== 0);
				expect(resources).toEqual({ mouton: 1 });
			});

			it('confirms the built road', function () {
				const message = this.p.client.lastMessage('play:add:road');
				expect(message.player).toEqual(this.p.id);
				expect(message.path).toEqual(this.path.toJson());
			});

			it('notifies others of the action', function () {
				const message = this.other.client.lastMessage('play:add:road');
				expect(message).toEqual({ player: this.p.id, path: this.path.toJson() });
			});
		});
	});

	describe('->play:add:colony', function () {
		describe('with proper resources', function () {
			beforeEach(function () {
				// Give enough resources to the player
				this.env.setPlayerResources(this.p, { bois: 2, tuile: 2, mouton: 1, ble: 1, caillou: 1 });
				const road = new Path(new Location(0, 2), new Location(-1, 3));
				this.p.client.receive('play:add:road', { path: road.toJson() });
				this.colony = new Location(-2, 3);
				this.p.client.receive('play:add:colony', { colony: this.colony.toJson() });
			});

			it('allows acquiring the colony', function () {
				const message = this.p.client.lastMessage('play:add:colony');
				expect(message._success).toBe(true);
			});

			it('notifies the player of its new resources', function () {
				const message = this.p.client.lastMessage('play:add:colony');
				const resources = _.pick(message.resources, value => value !== 0);
				expect(resources).toEqual({ caillou: 1 });
			});

			it('confirms the built colony', function () {
				const message = this.p.client.lastMessage('play:add:colony');
				expect(message.player).toEqual(this.p.id);
				expect(message.colony).toEqual(this.colony.toJson());
			});

			it('notifies others of the action', function () {
				const message = this.other.client.lastMessage('play:add:colony');
				expect(message).toEqual({ player: this.p.id, colony: this.colony.toJson() });
			});
		});
	});

});