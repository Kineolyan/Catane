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

		player.on('game:create', () => {
			var game = mgr.create();
			game.add(player);

			player.broadcast('game:list', {
				_success: true,
				games: mgr.list()
			});
			return { game: { id: game.id } };
		});

		player.on('game:list', () => ({ games: mgr.list() }) );

		player.on('game:join', gameId => {
			var game = this._games.get(gameId);
			if (game) {
				if (game === player.game) {
					throw new Error('Duplicated player in game ' + game.id);
				}

				if (undefined !== player.game) {
					let leavedGame = player.game;
					leavedGame.remove(player);

					this.broadcastPlayers(leavedGame);
				}

				if (game.add(player)) {
					// Notifies of success
					messages.ok(player, 'game:join');

					this.broadcastPlayers(game);
				} else {
					throw new Error(`Failed to add player ${player.id} to game ${game.id}`);
				}
			} else {
				throw new Error('unknown game ' + gameId);
			}
		});

		player.on('game:quit', () => {
			var game = player.game;
			if (game) {
				game.remove(player);

				this.broadcastPlayers(game);

				return true;
			} else {
				throw new Error(`Player ${player.id} belongs to no game`);
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

	/**
	 * Broadcasts players list to all players of a game.
	 * @param  {Players} game players of the game to consider
	 */
	broadcastPlayers(game) {
		var players = Array.from(game.players, (player) => ({ name: player.name, id: player.id }));
		var message = {
			_success: true,
			players: players
		};
		game.players.forEach(player => player.emit('game:players', message));
	}

}