import Game from './game';

import { MockSocket } from '../../com/mocks';
import Player from '../players/players';

describe('Game', function() {
	beforeEach(function() {
		this.game = new Game(1);
	});

	describe('after creation', function() {
		it('has id', function() {
			expect(this.game.id).toEqual(1);
		});

		it('has no players', function() {
			var players = Array.from(this.game.players, (player) => player);
			expect(players).toBeEmpty();
		});
	});

	describe('#add', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.player = new Player(this.client, 1);

			this.game.add(this.player);
		});

		it('has player among game\'s player', function() {
			var players = Array.from(this.game.players, (player) => player);
			expect(players).toContain(this.player);
		});

	});
});
