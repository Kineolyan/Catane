import { messages } from '../../com/messages.js';

export default class Player {

	constructor(socket, id) {
		var player = this;
		this._socket = socket;
		this._id = id;
		this._name = `Player ${id}`;

		socket.on('player:nickname', function(name) {
			player.register(name);
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
	 * @return {Player} this
	 */
	register(name) {
		this._name = name;

		return this;
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

	broadcast(channel, message) {
		this._socket.broadcast(channel, message);
	}

}