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

		player.on('game:join', function(gameId) {
			var game = mgr._games.get(gameId);
			if (game) {
				if (game.add(player)) {
					// Notifies of success
					messages.ok(player, 'game:join');

					// Sends updated list of players
					var players = Array.from(game.players, (player) => ({ name: player.name, id: player.id }));
					game.emit('game:players', {
						success: true,
						players: players
					});
				} else {
					player.emit('game:join', {
						success: false,
						message: 'duplicated player'
					});
				}
			} else {
				messages.ko(player, 'game:join');
			}
		});

		// player.on('game:start', function(gameId) {
		// 	var game = mgr._games.get(gameId);
		// 	if (game) {
		// 		if (!game.start()) {
		// 			messages.ko(player, 'game:start', `Game ${gameId} already started`);
		// 		}
		// 	} else {
		// 		messages.ko(player, 'game:start', `Game ${gameId} does not exist`);
		// 	}
		// });
	}

	/**
	 * Lists the id of all games.
	 * @return {Array} names of the existing games.
	 */
	list() {
		return Array.from(this._games.keys(), (value) => value);
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