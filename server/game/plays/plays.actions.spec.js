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

	describe('->play:card:buy', function () {
		describe('with proper resources', function () {
			beforeEach(function () {
				// Give enough resources to the player
				this.env.setPlayerResources(this.p, { caillou: 1, mouton: 1, ble: 1 });
				this.p.client.receive('play:card:buy');
			});

			it('allows acquiring the card', function () {
				const message = this.p.client.lastMessage('play:card:buy');
				expect(message._success).toBe(true);
			});

			it('notifies the player of its new card', function () {
				const message = this.p.client.lastMessage('play:card:buy');
				const cards = _.chain(message.cards).values().map('name').value();
				expect(cards).toEqual(['Score']);
			});

			it('notifies others of that players has a new card', function () {
				const message = this.other.client.lastMessage('play:card:buy');
				expect(message).toEqual({ player: this.p.id, cards: 1, _success: true });
			});
		});

		describe('without enough resources', function() {
			beforeEach(function() {
				this.env.setPlayerResources(this.p, { tuile: 4 });
				this.p.client.receive('play:card:buy');
			});

			it('fails to buy the card', function() {
				const message = this.p.client.lastMessage('play:card:buy');
				expect(message._success).toBe(false);
				expect(message.message).toMatch(/not enough resources/i);
			});
		});

		it('fails if it is not the player turn', function() {
			this.env.setPlayerResources(this.other, { caillou: 1, mouton: 1, ble: 1 });
			this.other.client.receive('play:card:buy');
			const message = this.other.client.lastMessage('play:card:buy');
			expect(message._success).toBe(false);
			expect(message.message).toMatch(/not.+turn/i);
		});
	});

	describe('->play:card:use', function () {
		describe('with proper resources', function () {
			beforeEach(function () {
				// Give enough resources to the player
				this.env.setPlayerResources(this.p, { caillou: 1, mouton: 1, ble: 1 });
				this.p.client.receive('play:card:buy');
				this.cardId = _.first(_.keys(this.p.client.lastMessage('play:card:buy').cards));
				this.p.client.receive('play:card:use', { card: { id: this.cardId } });
			});

			it('allows using the card', function () {
				const message = this.p.client.lastMessage('play:card:use');
				expect(message._success).toBe(true);
			});
		});

		describe('without card', function() {
			beforeEach(function() {
				this.p.client.receive('play:card:use', { card: { id: '13' } });
			});

			it('fails to use the card', function() {
				const message = this.p.client.lastMessage('play:card:use');
				expect(message._success).toBe(false);
				expect(message.message).toMatch(/no card 13/i);
			});
		});

		it('fails if it is not the player turn', function() {
			this.other.client.receive('play:card:use', { card: { id: '52' } });
			const message = this.other.client.lastMessage('play:card:use');
			expect(message._success).toBe(false);
			expect(message.message).toMatch(/not.+turn/i);
		});
	});

});
