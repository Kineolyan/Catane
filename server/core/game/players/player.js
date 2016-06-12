export class BasePlayer {

	constructor(socket, id) {
		this._socket = socket;
		this._id = id;
		this._name = `Player ${id}`;
		this._game = undefined;
		this._score = 0;

		this._socket.on('player:nickname', (name) => {
			this._name = name;
			var message = {	player: { id: this._id, name: this._name } };
			this.broadcast('player:nickname', message);

			message._success = true;
			return message;
		});
	}

	/**
	 * Gets the player id.
	 * @return {String} id
	 */
	get id() {
		return this._id;
	}

	/**
	 * Gets the socket used for communtication.
	 * @return {Socket} the socket
	 */
	get socket() {
		return this._socket;
	}

	/**
	 * Sets the player socket.
	 * @param {Socket} socket the instance of socket.
	 */
	set socket(socket) {
		this._socket = socket;
	}

	/**
	 * Gets the player name.
	 * @return {String} name
	 */
	get name() {
		return this._name;
	}

	/**
	 * Registers the name of the user
	 * @param  {String} name the new name of the player
	 */
	set name(name) {
		this._name = name;
	}

	/**
	 * Gets the game the player belongs to.
	 * @return {CataneGame} the game
	 */
	get game() {
		return this._game;
	}

	/**
	 * Sets the game the player has joined
	 * @param  {CataneGame} game the joined game
	 */
	set game(game) {
		if (game && this._game) {
			throw new Error(`Player ${this._id} (${this._name} already joined game ${this._game}. Cannot be added to ${game}`);
		}
		this._game = game;
	}

	/**
	 * Gets the score of the player.
	 * @returns {number} player score
	 */
	get score() {
		return this._score;
	}

	/**
	 * Increments the score of the player by the number of points given.
	 * @param {Number} nbPoints number of points won by the user
	 * @throws Error if the number of points is null or negative
	 */
	winPoints(nbPoints) {
		if (nbPoints > 0) {
			this._score += nbPoints;
		} else {
			throw new Error(`Negative or null value provided: ${nbPoints}`);
		}
	}

	toString() {
		return `Player '${this._name}' [${this._id}]`;
	}

	toJson() {
		return {
			id: this._id, name: this._name
		};
	}

	/**
	 * Binds to the inner client #emit.
	 * @param  {String}   channel event name to listen to
	 * @param  {Object} 	message content to send
	 */
	emit(channel, message) {
		this._socket.emit(channel, message);
	}

	/**
	 * Broadcasts a message to all other players
	 * @param  {String} channel on which sends the message
	 * @param  {Object} message to send
	 */
	broadcast(channel, message) {
		this._socket.broadcast(channel, message);
	}

	/**
	 * Sends a message to all other connected players
	 * @param  {String} channel event name to listen to
	 * @param  {Object} message content to send
	 */
	all(channel, message) {
		this._socket.all(channel, message);
	}
}

export class BasePlayerDecorator {
	/**
	 * Constructor
	 * @param {BasePlayer} player player to wrap
	 */
	constructor(player) {
		this._player = player;
	}

	/**
	 * Gets the player id.
	 * @return {String} id
	 */
	get id() {
		return this._player.id;
	}

	/**
	 * Gets the socket used for communtication.
	 * @return {Socket} the socket
	 */
	get socket() {
		return this._player.socket;
	}

	/**
	 * Sets the player socket.
	 * @param {Socket} socket the instance of socket.
	 */
	set socket(socket) {
		this._player.socket = socket;
	}

	/**
	 * Gets the player name.
	 * @return {String} name
	 */
	get name() {
		return this._player.name;
	}

	/**
	 * Registers the name of the user
	 * @param  {String} name the new name of the player
	 */
	set name(name) {
		this._player.name = name;
	}

	/**
	 * Gets the game the player belongs to.
	 * @return {CataneGame} the game
	 */
	get game() {
		return this._player.game;
	}

	/**
	 * Sets the game the player has joined
	 * @param  {CataneGame} game the joined game
	 */
	set game(game) {
		this._player.game = game;
	}

	/**
	 * Gets the score of the player.
	 * @returns {number} player score
	 */
	get score() {
		return this._player.score;
	}

	/**
	 * Increments the score of the player by the number of points given.
	 * @param {Number} nbPoints number of points won by the user
	 * @throws Error if the number of points is null or negative
	 */
	winPoints(nbPoints) {
		this._player.winPoints(nbPoints);
	}

	toString() {
		return this._player.toString();
	}

	toJson() {
		return this._player.toJson();
	}

	/**
	 * Binds to the inner client #emit.
	 * @param  {String}   channel event name to listen to
	 * @param  {Object} 	message content to send
	 */
	emit(channel, message) {
		this._player.emit(channel, message);
	}

	/**
	 * Broadcasts a message to all other players
	 * @param  {String} channel on which sends the message
	 * @param  {Object} message to send
	 */
	broadcast(channel, message) {
		this._player.broadcast(channel, message);
	}

	/**
	 * Sends a message to all other connected players
	 * @param  {String} channel event name to listen to
	 * @param  {Object} message content to send
	 */
	all(channel, message) {
		this._player.all(channel, message);
	}
}

export default BasePlayer;
