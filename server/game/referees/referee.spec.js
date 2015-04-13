import Referee from './referee';

import { MockSocket } from '../../com/mocks';
import Player from '../players/player';

describe('Referee', function() {
	beforeEach(function() {
		this.socket = new MockSocket();

		this.board = null;
		this.players = [
			new Player(this.socket, 1),
			new Player(this.socket, 2),
			new Player(this.socket, 3)
		];
		this.playerIds = this.players.map(player => player.id);

		this.referee = new Referee(this.board, this.players);
	});

	describe('constructor', function() {
		it('selects a player as current', function() {
			expect(this.referee.currentPlayer.id).toBeIn(this.playerIds);
		});
	});

	describe('#isTurn', function() {
		it('is only turn of one player', function() {
			for (let player of this.players) {
				let isCurrentPlayer = this.referee.currentPlayer.id === player.id;
				expect(this.referee.isTurn(player)).toBe(isCurrentPlayer);
			}
		});
	});

	describe('#endTurn', function() {
		beforeEach(function() {
			this.firstPlayer = this.referee.currentPlayer;
		});

		describe('without required actions', function() {
			it('requires dice rolling', function() {
				expect(() => this.referee.endTurn()).toThrowError(Error, /pending actions/i);
			});

			it('requires thief move on 7\'s', function() {
				this.referee.rollDice(7); // Need to move thiefs

				expect(() => this.referee.endTurn()).toThrowError(Error, /pending actions/i);
			});
		});

		describe('when ok', function() {
			beforeEach(function() {
				this.referee.rollDice(6);
				this.referee.endTurn();
			});

			it('changes to another player', function() {
				expect(this.referee.currentPlayer.id).not.toBe(this.firstPlayer.id);
				expect(this.referee.currentPlayer.id).toBeIn(this.playerIds);
			});

			it('loops on the players', function() {
				// After 5 more changes, we return to the first players
				for (let i = 0; i < 5; i += 1) {
					this.referee.rollDice(8);
					this.referee.endTurn();
				}
				expect(this.referee.currentPlayer.id).toBe(this.firstPlayer.id);
			});
		});
	});

	describe('#canRollDice', function() {
		it('can roll dice at first', function() {
			expect(this.referee.canRollDice()).toBe(true);
		});

		it('cannot roll dice more than once', function() {
			this.referee.rollDice(2);
			expect(this.referee.canRollDice()).toBe(false);
		});
	});

	describe('#moveThieves', function() {
		beforeEach(function() {
			this.referee.rollDice(7);
			this.referee.moveThieves();
		});

		it('allows player to end turn', function() {
			expect(() => this.referee.endTurn()).not.toThrow();
		});
	});

});