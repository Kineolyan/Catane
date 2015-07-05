import * as maps from 'server/util/maps.js';

export default class Player {

	constructor(socket, id) {
		this._socket = socket;
		this._id = id;
		this._name = `Player ${id}`;
		this._game = undefined;
		this._resources = {};

		socket.on('player:nickname', (name) => {
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
	 * @return {Game} the game
	 */
	get game() {
		return this._game;
	}

	/**
	 * Sets the game the player has joined
	 * @param  {Game} game the joined game
	 */
	set game(game) {
		this._game = game;
	}

	get resources() {
		return this._resources;
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
	 * Decides if the given player has enough resources to
	 * comply the given cost.
	 * @param  {Player}  player the player to check
	 * @param  {Object}  costs   the cost of the operation
	 * @return {Boolean} true if everything is ok
	 */
	hasResources(costs) {
		for (let [r, cost] of maps.entries(costs)) {
			if (typeof cost !== 'number' || isNaN(cost)) { throw new TypeError(`Cost '${cost}' is not a number`); }

			let quantity = this._resources[r] || 0;
			if (quantity < cost) { return false; }
		}
		return true;
	}

	/**
	 * Adds new resources to the player belongings.
	 * @param  {Array|Object} resources the new resources as
	 *   an array of resource names or a map giving the number
	 *   per name.
	 */
	receiveResources(resources) {
		if (resources.constructor === Array) {
			for (let resource of resources) {
				this._updateResource(resource, 1);
			}
		} else {
			for (let [resource, value] of maps.entries(resources)) {
				this._updateResource(resource, value);
			}
		}
	}

	/**
	 * Removes resources from the player belongings.
	 * @param  {Array|Object} resources the used resources as
	 *   an array of resource names or a map giving the number
	 *   per name.
	 */
	useResources(resources) {
		if (resources.constructor === Array) {
			for (let resource of resources) {
				this._updateResource(resource, -1);
			}
		} else {
			for (let [resource, value] of maps.entries(resources)) {
				this._updateResource(resource, -value);
			}
		}
	}

	/**
	 * Updates a resource by a given number.
	 * @param resource the resource name
	 * @param value the value to add to the current
	 * @private
	 */
	_updateResource(resource, value) {
		this._resources[resource] = (this._resources[resource] || 0) + value;
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