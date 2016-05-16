import { logger } from 'libs/log/logger';

export default class AGame {
	/**
	 * Constructor
	 * @param  {Object} id player's id
	 */
	constructor(id, minPlayers, maxPlayers) {
		this._id = id;
		this._players = new Set();
		this._started = false;
		this._options = {
			minPlayers, maxPlayers: maxPlayers || Number.MAX_SAFE_INTEGER
		};
	}

	/**
	 * Gets the id of the player
	 * @return {Number} player's id
	 */
	get id() {
		return this._id;
	}

	/**
	 * Gets the list of players
	 * @return {Set} the game's player
	 */
	get players() {
		return this._players;
	}

	/**
	 * Indicates if the game has started.
	 * @return {Boolean} true if the game started, false otherwise
	 */
	isStarted() {
		return this._started;
	}

	/**
	 * Adds a new player to the game.
	 * @param {User} user user holding a player to add
	 * @return {boolean} true if the player is added, false if it was already
	 *   present.
	 */
	add(user) {
		const corePlayer = user.player;
		if (!this._players.has(corePlayer)) {
			// Decorates the player for the game
			const gamePlayer = this.createGamePlayer(corePlayer);
			user.player = gamePlayer;

			this._players.add(gamePlayer);
			gamePlayer.game = this;
			return true;
		} else {
			return false;
		}
	}

	remove(user) {
		const gamePlayer = user.player;
		if (this._players.has(gamePlayer)) {
			this._players.delete(gamePlayer);
			gamePlayer.game = undefined;
			user.player = gamePlayer._player;

			return true;
		} else {
			return false;
		}
	}

	/**
	 * Gets the player of a given id.
	 * @param {Number} pId the player id
	 * @return {BasePlayer|null} the player or null if it does not exist
	 */
	getPlayer(pId) {
		for (let player of this._players) {
			if (player.id === pId) {
				return player;
			}
		}
		return null;
	}

	/**
	 * Emits the message on the channel to all players of the game.
	 * @param {BasePlayer|String} player the current player, defined to exclude the player for the broadcast.
	 * @param {String|Object=} channel name of the event
	 * @param {Object=} message message to send
	 */
	emit(player, channel, message) {
		var excludedId;
		if (typeof player === 'string') {
			// It does not define any player
			message = channel;
			channel = player;
			excludedId = -1;
		} else {
			excludedId = player.id;
		}

		this._players.forEach(player => {
			if (player.id !== excludedId) {
				player.emit(channel, message);
			}
		});
	}

	start() {
		if (this._started) {
			throw new Error(`Game ${this._id} already started`);
		}

		if (this._players.size < this._options.minPlayers) {
			throw new Error(`Not enough players in the game. Condition: ${this._players.size} >= ${this._options.minPlayers}`);
		} else if (this._players.size > this._options.maxPlayers) {
			throw new Error(`Too enough players in the game. Condition: ${this._players.size} <= ${this._options.maxPlayers}`);
		}

		this._started = true;
		logger.info(`Game ${this.id} starting ...`);

		this.doStart();
	}

	/**
	 * Reloads the game for the client.
	 * This gets the description of the game.
	 * @return {Object} the description of the current game.
	 */
	reload() {
		var orderedPlayers = this._referee.players.map(player => player.toJson());
		return {
			board: this._board.toJson(),
			players: orderedPlayers,
			currentPlayer: this._referee.currentPlayer.id
		};
	}
}