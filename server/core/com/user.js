export class User {
	/**
	 * Constructor
	 * @param  {Socket} socket the connected socket
	 * @param  {BasePlayer} player the associated player
	 */
	constructor(socket, player) {
		this._socket = socket;
		this._player = player;
	}

	get socket() {
		return this._socket;
	}

	get player() {
		return this._player;
	}

	set player(player) {
		if (player) {
			this._player = player;
			this._player.socket = this._socket;
		} else {
			this._player = player;
		}
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

export default User;