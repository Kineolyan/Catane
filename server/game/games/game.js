import Board from '../../elements/boards/board';
import { RoundGenerator } from '../../elements/boards/generators/generators';

export default class Game {
	/**
	 * Constructor
	 * @param  {Object} id player's id
	 */
	constructor(id) {
		this._id = id;
		this._players = new Set();
		this._started = false;
	}

	/**
	 * Gets the id of the player
	 * @return {Integer} player's id
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
	 * Adds a new player to the game.
	 * @param {Player} player the player to add
	 * @return {boolean} true if the player is added, false if it was already
	 *   present.
	 */
	add(player) {
		if (!this._players.has(player)) {
			this._players.add(player);
			player.game = this;
			return true;
		} else {
			return false;
		}
	}

	remove(player) {
		if (this._players.has(player)) {
			this._players.delete(player);
			player.game = undefined;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Emits the message on the channel to all players of the game.
	 * @param  {String} channel name of the event
	 * @param  {Object} message message to send
	 */
	emit(channel, message) {
		this._players.forEach(player => player.emit(channel, message));
	}

	start() {
		if (this._started) { throw new Error(`Game ${this._id} already started`); }
		if (this._players.size < 2) { throw new Error(`Not enough players in the game (${this._players.size})`); }

		this._started = true;
		this._board = new Board();
		this._board.generate(new RoundGenerator(2));

		var description = { tiles: [] };
		for (let tile of this._board.tiles) {
			description.tiles.push({
				x: tile.location.x,
				y: tile.location.y,
				resource: tile.resource
			});
		}

		this._players.forEach( player => player.emit('game:start', { _success: true, board: description }) );
	}
}