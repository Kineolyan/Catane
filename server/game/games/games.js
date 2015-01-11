import Game from './game';
import { idGenerator } from '../util';
import { messages } from '../../com/messages';

const logger = global.logger;

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
		player.on('game:create', () => {
			var game = this.create();
			game.add(player);

			player.broadcast('game:list', {
				_success: true,
				games: this.list()
			});
			return { game: { id: game.id } };
		});

		player.on('game:list', () => ({ games: this.list() }) );

		player.on('game:join', gameId => {
			var game = this._games.get(gameId);
			if (game) {
				return this.join(game, player);
			} else {
				throw new Error('unknown game ' + gameId);
			}
		});

		player.on('game:quit', () => {
			var game = player.game;
			if (game) {
				return this.quit(game, player);
			} else {
				throw new Error(`Player ${player.id} belongs to no game`);
			}
		});

		player.on('game:start', (gameId) => {
			var game = this._games.get(gameId);
			if (game) {
				game.start();
				return true;
			} else {
				throw new Error(`Unknown game ${gameId}`);
			}
		});
	}

	/**
	 * Unregisters a player from the games manager
	 * @param  {Player} player player to unregister
	 */
	unregister(player) {
		if (player.game) {
			this.quit(player.game, player);
		}
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
		logger.log(`[Server] New game created ${game.id}`);

		return game;
	}

	/**
	 * Destroys a game.
	 * @param {Game} the game to destroy
	 */
	destroy(game) {
		if (game.players.size === 0) {
			this._games.delete(game.id);
			logger.log(`[Server] Game ${game.id} destroyed`);
		} else {
			throw new Error(`Game ${game.id} still has ${game.players.size} players`);
		}
	}

	join(game, player) {
		if (game === player.game) {
			throw new Error('Duplicated player in game ' + game.id);
		}

		if (undefined !== player.game) {
			let leavedGame = player.game;
			leavedGame.remove(player);

			if (leavedGame.players.size > 0) {
				this.broadcastPlayers(leavedGame);
			} else {
				this.destroy(leavedGame);
				player.all('game:list', { games: this.list() });
			}
		}

		if (game.add(player)) {
			// Notifies of success
			messages.ok(player, 'game:join');

			this.broadcastPlayers(game);
		} else {
			throw new Error(`Failed to add player ${player.id} to game ${game.id}`);
		}
	}

	quit(game, player) {
		if (game.remove(player)) {
			if (game.players.size > 0) {
				this.broadcastPlayers(game);
			} else {
				this.destroy(game);
				player.all('game:list', { games: this.list() });
			}
			return true;
		} else {
			return false;
		}
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