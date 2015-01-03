import Game from './game';
import { idGenerator } from '../util';

export default class Games {
	constructor() {
		this._games = new Map();
		this.nextGameId = idGenerator();
	}

	register(player) {
		var mgr = this;
		player.on('game:create', function() {
			var game = mgr.create();
			// game.add(player);

			player.emit('game:create', {
				success: true,
				game: game.id
			});
		});
		player.on('game:list', function () {
			player.emit('game:list', {
				success: true,
				games: mgr.list()
			});
		});
	}

	list() {
		return Array.from(this._games.keys(), (value) => value);
	}

	create() {
		var game = new Game(this.nextGameId());
		this._games.set(game.id, game);

		return game;
	}

}