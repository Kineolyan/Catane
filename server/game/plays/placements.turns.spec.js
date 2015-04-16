import * as starter from '../games/game-spec.starter.js';

describe('Placement turn management', function() {
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

	describe('on colony picking', function() {
		beforeEach(function() {
			this.startGame();

			this.pickedLocation = { x: 0, y: 1 };
			this.p1.client.receive('play:pick:colony', { colony: this.pickedLocation });
		});

		it('notifies all players of the selection', function() {
			var firstPlayerId = this.p1.id;

			for (let p of this.players) {
				let message  = p.client.lastMessage('play:pick:colony');
				expect(message.player).toEqual(firstPlayerId);
				expect(message.colony).toEqual(this.pickedLocation);
			}
		});
	});

	describe('on road picking', function() {

	});

	describe('on turn end', function() {
		//beforeEach(function() {
		//	this.startGame();
		//
		//	this.p1.client.receive('play:roll-dice');
		//	var diceValue = this.getLastDiceValue();
		//	if (diceValue === 7) { this.p1.client.receive('play:move:thieves'); }
		//
		//	this.p1.client.receive('play:turn:end');
		//});
		//
		//it('notifies all players of a new turn', function() {
		//	for (let p of this.players) {
		//		let message = p.client.lastMessage('play:turn:new');
		//		expect(message.player).toBe(this.p2.id);
		//	}
		//});
		//
		//it('elects the next player', function() {
		//	let message = this.players[0].client.lastMessage('play:turn:new');
		//	expect(message.player).not.toBe(this.p1.id);
		//});
	});

});