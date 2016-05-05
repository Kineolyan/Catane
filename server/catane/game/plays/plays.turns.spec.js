import * as starter from 'server/catane/game/games//game-spec.starter.js';

describe('Play turn management', function() {
	beforeEach(function() {
		this.game = starter.createGame(2);
		this.players = this.game.players;

		// Start the game for all
		this.game.start();

		this.p1 = this.players[0];
		this.p2 = this.players[1];

		this.game.randomPick();

		this.getLastDiceValue = function() {
			var message = this.players[0].client.lastMessage('play:roll-dice');
			return message.dice[0] + message.dice[1];
		};
	});

	describe('on game started', function() {
		it('notifies all players of a new turn', function() {
			var firstPlayerId = this.p1.id;
			for (let p of this.players) {
				expect(p.client.lastMessage('play:turn:new')).toEqual({ player: firstPlayerId });
			}
		});
	});

	describe('on a turn end', function() {
		beforeEach(function() {
			this.p1.client.receive('play:roll-dice');
			var diceValue = this.getLastDiceValue();
			if (diceValue === 7) {
				let newThievesLocation = this.game.thieves.hashCode() === 0 ?
					{ x: 1, y: 1 } : { x: 0, y: 0 };
				this.p1.client.receive('play:move:thieves', { tile: newThievesLocation });
			}

			this.p1.client.receive('play:turn:end');
		});

		it('notifies all players of a new turn', function() {
			for (let p of this.players) {
				let message = p.client.lastMessage('play:turn:new');
				expect(message.player).toBe(this.p2.id);
			}
		});

		it('elects the next player', function() {
			let message = this.players[0].client.lastMessage('play:turn:new');
			expect(message.player).not.toBe(this.p1.id);
		});
	});

	describe('roll dice', function() {
		beforeEach(function() {
			this.p1.client.receive('play:roll-dice');
		});

		it('draws the dice value', function() {
			var values = this.p1.client.lastMessage('play:roll-dice').dice;
			expect(values).toHaveLength(2);
			expect(values[0]).toBeIn([1, 2, 3, 4, 5, 6]);
			expect(values[1]).toBeIn([1, 2, 3, 4, 5, 6]);
		});

		it('sends the values for the dice to all players', function() {
			var values = this.p1.client.lastMessage('play:roll-dice').dice;
			for (let p of this.players) {
				let pValues = p.client.lastMessage('play:roll-dice').dice;
				expect(pValues).toEqual(values);
			}
		});

		it('sends the resources to all players', function() {
			for (let p of this.players) {
				let message = p.client.lastMessage('play:roll-dice');
				expect(message).toHaveKey('resources');
			}
		});

		// TODO test the updates or not of the resources
	});

	describe('move thieves', function() {
		beforeEach(function() {
			this.p1.client.receive('play:roll-dice');
			// No need to check if the value is a 7 yet (can move thieves without cards)
			this.newThievesLocation = this.game.thieves.hashCode() === 0 ? { x: 1, y: 1 } : { x: 0, y: 0 };
			this.p1.client.receive('play:move:thieves', { tile: this.newThievesLocation });
		});

		it('sends an update of the thieves position', function() {
			for (let p of this.players) {
				let message = p.client.lastMessage('play:move:thieves');
				expect(message.tile).toEqual(this.newThievesLocation);
			}
		});
	});

	describe('exchange', function() {
		beforeEach(function() {
			[this.p,  this.other] = this.game.players;
			this.game.rollDice(this.p);
		});

		describe('when offering resources', function() {
			beforeEach(function() {
				this.p.client.receive('play:resources:offer', {
					to: this.other.id,
					give: { ble: 1 },
					receive: { bois: 1 }
				});
			});

			it('sends the exchange id to the player', function() {
				var message = this.p.client.lastMessage('play:resources:offer');
				expect(message.exchange.id).toBeAnInteger();
			});

			it('sends the exchange proposal to the other player', function() {
				var message = this.other.client.lastMessage('play:resources:offer');
				expect(message).toHaveKey('exchange');

				var exchange = message.exchange;
				expect(exchange.id).toEqual(this.p.client.lastMessage('play:resources:offer').exchange.id);
				expect(exchange.from).toEqual(this.p.id);
				expect(exchange.give).toEqual({ bois: 1 });
				expect(exchange.receive).toEqual({ ble: 1 });
			});
		});

		describe('when rejecting an offer', function() {
			beforeEach(function() {
				this.p.client.receive('play:resources:offer', {
					to: this.other.id,
					give: { ble: 1 },
					receive: { bois: 1 }
				});

				this.eId = this.p.client.lastMessage('play:resources:offer').exchange.id;
				this.other.client.receive('play:resources:exchange', { id: this.eId, status: 'reject' });
			});

			it('notifies the player of the rejection', function() {
				var message = this.p.client.lastMessage('play:resources:exchange');
				expect(message.exchange).toEqual({ id: this.eId, status: 'cancelled' });
			});

			it('confirms to the other player the rejection', function() {
				var message = this.p.client.lastMessage('play:resources:exchange');
				expect(message.exchange).toEqual({ id: this.eId, status: 'cancelled' });
			});

			it('does not reference the exchange anymore', function() {
				this.other.client.receive('play:resources:exchange', { id: this.eId });

				var message = this.other.client.lastMessage('play:resources:exchange');
				expect(message.message).toMatch(/Unexisting exchange/i);
			});
		});

		describe('when accepting an offer', function() {
			beforeEach(function() {
				// Normally, both players should have resources
				this.pResources = this.p.client.lastMessage('play:roll-dice').resources;
				this.otherResources = this.other.client.lastMessage('play:roll-dice').resources;

				this.p.client.receive('play:resources:offer', {
					to: this.other.id,
					give: this.pResources,
					receive: this.otherResources
				});

				this.eId = this.p.client.lastMessage('play:resources:offer').exchange.id;
				this.other.client.receive('play:resources:exchange', { id: this.eId, status: 'accept' });
			});

			it('notifies the player of the exchange completion', function() {
				var message = this.p.client.lastMessage('play:resources:exchange');
				expect(message.exchange).toEqual({ id: this.eId, status: 'done' });
				expect(message).toHaveResources(this.otherResources);
			});

			it('notifies the other player of the exchange completion', function() {
				var message = this.other.client.lastMessage('play:resources:exchange');
				expect(message.exchange).toEqual({ id: this.eId, status: 'done' });
				expect(message).toHaveResources(this.pResources);
			});

			it('does not reference the exchange anymore', function() {
				this.other.client.receive('play:resources:exchange', { id: this.eId });

				var message = this.other.client.lastMessage('play:resources:exchange');
				expect(message.message).toMatch(/Unexisting exchange/i);
			});
		});

		it('fails on unexisting exchange', function() {
			this.p.client.receive('play:resources:exchange', { id: 123456789 });

			var message = this.p.client.lastMessage('play:resources:exchange');
			expect(message.message).toMatch(/Unexisting exchange 123456789/i);
		});

		it('fails when exchange creator validates it', function() {
			this.p.client.receive('play:resources:offer', {
				to: this.other.id,
				give: { ble: 1 },
				receive: { bois: 1 }
			});

			this.eId = this.p.client.lastMessage('play:resources:offer').exchange.id;
			this.p.client.receive('play:resources:exchange', { id: this.eId, status: 'accept' });

			var message = this.p.client.lastMessage('play:resources:exchange');
			expect(message.message).toMatch(/Wrong receiver/i);
		});
	});

});