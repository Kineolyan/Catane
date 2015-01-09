import { messages } from '../../com/messages.js';

export default class Player {

	constructor(socket, id) {
		var player = this;
		this._socket = socket;
		this._id = id;
		this._name = `Player ${id}`;
		this._game = undefined;

		socket.on('player:nickname', function(name) {
			player.name = name;
			messages.ok(player._socket, 'player:nickname');
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
	 * Gets the player name.
	 * @return {String} name
	 */
	get name() {
		return this._name;
	}

	/**
	 * Register the name of the user
	 * @param  {String} the new name of the player
	 * @return {String} the name set
	 */
	set name(name) {
		this._name = name;

		return name;
	}

	/**
	 * Gest the game the player belongs to.
	 * @return {Game} the game
	 */
	get game() {
		return this._game;
	}

	/**
	 * Sets the game the player has joined
	 * @param  {Game} the joined game
	 * @return {Player} this
	 */
	set game(game) {
		this._game = game;

		return game;
	}

	/**
	 * Binds to the inner client #on.
	 * @param  {String}   channel  event name to listen to
	 * @param  {Function} callback action to perform on event
	 */
	on(channel, callback) {
		this._socket.on(channel, callback);
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