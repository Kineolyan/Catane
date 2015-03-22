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
			this.referee.endTurn();
		});

		it('changes to another player', function() {
			expect(this.referee.currentPlayer.id).not.toBe(this.firstPlayer.id);
			expect(this.referee.currentPlayer.id).toBeIn(this.playerIds);
		});

		it('loops on the players', function() {
			// After 5 more changes, we return to the first players
			for (let i = 0; i < 5; i += 1) { this.referee.endTurn(); }
			expect(this.referee.currentPlayer.id).toBe(this.firstPlayer.id);
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

});