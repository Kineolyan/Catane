import * as starter from '../games/game-spec.starter.js';

xdescribe('Play turn management', function() {
	beforeEach(function() {
		this.game = starter.createGame(2);
		this.players = this.game.players;

		this.startGame = function() {
			this.game.start();

			var firstPlayer = this.players[0].client.lastMessage('play:turn:new').player;
			for (let p of this.players) {
				if (p.id === firstPlayer) {
					this.p1 = p;
				} else {
					this.p2 = p;
				}
			}
		};

		this.getLastDiceValue = function() {
			var message = this.players[0].client.lastMessage('play:roll-dice');
			return message.dice[0] + message.dice[1];
		};
	});

	describe('on game started', function() {
		beforeEach(function() {
			this.startGame();
		});

		it('notifies all players of a new turn', function() {
			var firstPlayerId = this.p1.id;
			for (let p of this.players) {
				expect(p.client.lastMessage('play:turn:new')).toEqual({ player: firstPlayerId });
			}
		});
	});

	describe('on a turn end', function() {
		beforeEach(function() {
			this.startGame();

			this.p1.client.receive('play:roll-dice');
			var diceValue = this.getLastDiceValue();
			if (diceValue === 7) { this.p1.client.receive('play:move:thieves'); }

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
			this.startGame();

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

	});

});