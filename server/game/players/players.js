import { messages } from '../../com/messages.js';

export default class Player {
	constructor(socket) {
		var player = this;
		this._socket = socket;

		socket.on('player:register', function(name) {
			player.register(name);
			messages.ok(player._socket, 'player:register');
		});
	}

	/**
	 * Register the name of the user
	 * @param  {String} the new name of the player
	 */
	register(name) {
		this._name = name;
		// TODO send a message to say ok
	}

	get name() {
		return this._name;
	}
}