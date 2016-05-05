import BasePlayer from 'server/core/game/players/player';
import User from 'server/core/com/user';
import Games from 'server/catane/game/games/games';
import Plays from 'server/catane/game/plays/plays';
import { idGenerator } from 'server/core/game/util';

const logger = global.logger;
const TIME_TO_RECONNECT = global.TIME_TO_RECONNECT;

export default class Server {
	constructor(id = Date.now()) {
		this._id = id;
		this._users = new Map();
		this._nextPlayerId = idGenerator();

		this._resources = [
			new Games(),
			new Plays()
		];
	}

	get id() {
		return this._id;
	}

	get users() {
		return this._users;
	}

  /**
   * Connects a socket to the server.
   * @param  {Socket} socket with client connection
   */
	connect(socket) {
		var player = new BasePlayer(socket, this._nextPlayerId().toString());
		var user = new User(socket, player);
		this._users.set(socket.id, user);
		logger.log(`[Server] ${player.name} is connected`);

		for (let resource of this._resources) {
			resource.register(user);
		}

		socket.emit('init', {
			message: 'welcome',
			server: { id: this.id, sid: socket.id },
			player: player.toJson()
		});

		socket.on('disconnect', () => this.disconnect(socket));

		socket.on('server:reconnect', (sid) => {
			this.reconnect(socket, sid);
			var reconnectedUser = this._users.get(socket.id);
			return { player: reconnectedUser.player.toJson() };
		});
	}

	disconnect(socket) {
		var user = this._users.get(socket.id);
		var game = user.player.game;
		if (game && game.isStarted()) {
			// Keep the player if he/she is playing
			setTimeout(() => {
				// Remove the user if it still exists
				if (this._users.has(socket.id)) {
					// No reconnection in the ellapsed time
					this.doDisconnect(socket);
				}
			}, TIME_TO_RECONNECT);
		} else {
			this.doDisconnect(socket);
		}
	}

	doDisconnect(socket) {
		var user = this._users.get(socket.id);
		if (user) {
			this.unregister(user);

			logger.log(`[Server] ${user.player.name} is disconnected`);
			this._users.delete(socket.id);
		} else {
			logger.error(`[Server] Unknown user ${user.toString()} disconnected`);
		}
	}

	/**
	 * Reconnects a player to its previous state.
	 * @param  {Socket} socket the current player socket
	 * @param  {Number} sid the previous socket id
	 */
	reconnect(socket, sid) {
		var previousUser = this._users.get(sid);
		if (previousUser !== undefined) {
			var currentUser = this._users.get(socket.id);

			// Rebind the socket to the previous
			currentUser.player = previousUser.player;
			previousUser.player = null;

			// Unregister the previous user
			this.unregister(previousUser);
			this._users.delete(sid);

			logger.log(`[Server] ${currentUser.player.name} is reconnected`);
		} else {
			throw new Error(`Socket ${sid} does not exist (anymore)`);
		}
	}

	unregister(user) {
		for (let resource of this._resources) {
			resource.unregister(user);
		}
	}
}