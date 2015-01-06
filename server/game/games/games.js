import Game from './game';
import { idGenerator } from '../util';
import { messages } from '../../com/messages';

export default class Games {
	constructor() {
		this._games = new Map();
		this.nextGameId = idGenerator();
	}

	/**
	 * Registers a new player to the games manager
	 * @param  {Player} player player to register
	 */
	register(player) {
		var mgr = this;
		player.on('game:create', function() {
			var game = mgr.create();
			game.add(player);

			player.broadcast('game:list', {
				_success: true,
				games: mgr.list()
			});
			return { game: { id: game.id } };
		});
		player.on('game:list', function () {
			return {
				games: mgr.list()
			};
		});

		player.on('game:join', function(gameId) {
			var game = mgr._games.get(gameId);
			if (game) {
				if (game.add(player)) {
					// Notifies of success
					messages.ok(player, 'game:join');

					// Sends updated list of players
					var players = Array.from(game.players, (player) => ({ name: player.name, id: player.id }));
					game.emit('game:players', {
						_success: true,
						players: players
					});
				} else {
					throw new Error('duplicated player');
				}
			} else {
				throw new Error('unknown game ' + gameId);
			}
		});

		player.on('game:start', function(gameId) {
			var game = mgr._games.get(gameId);
			if (game) {
				game.start();
				return true;
			} else {
				throw new Error(`Unknown game ${gameId}`);
			}
		});
	}

	/**
	 * Lists the id of all games.
	 * @return {Array} names of the existing games.
	 */
	list() {
		return Array.from(this._games.keys(), (gameId) => ({ id: gameId }));
	}

	/**
	 * Create a new game.
	 * @return {Game} the newly created game
	 */
	create() {
		var game = new Game(this.nextGameId());
		this._games.set(game.id, game);

		return game;
	}

}