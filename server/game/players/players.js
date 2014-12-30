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
	 */
	register(name) {
		this._name = name;
		// TODO send a message to say ok
	}
}