import Player from './game/players/player';
import Games from './game/games/games';
import Plays from './game/plays/plays';
import { idGenerator } from './game/util';

const logger = global.logger;
const TIME_TO_RECONNECT = global.TIME_TO_RECONNECT;

export default class Server {
	constructor(id = (new Date()).getTime()) {
		this._id = id;
		this._players = {};
		this._nextPlayerId = idGenerator();

		this._resources = [
			new Games(),
			new Plays()
		];
	}

	get id() {
		return this._id;
	}

	get players() {
		return this._players;
	}

  /**
   * Connects a socket to the server.
   * @param  {Socket} socket with client connection
   */
	connect(socket) {
		var player = new Player(socket, this._nextPlayerId().toString());
		this.players[socket.id] = player;
		logger.log(`[Server] ${player.name} is connected`);
		socket.emit('init', {
			message: 'welcome',
			server: { id: this.id, sid: socket.id },
			player: { name: player.name, id: player.id }
		});

		for (let resource of this._resources) {
			resource.register(player);
		}

		socket.on('reconnect', (sid) => {
			this.reconnect(socket, sid);
			return true;
		});
	}

	disconnect(socket) {
		var player = this.players[socket.id];
		if (player.game && player.game.isStarted()) {
			// Keep the player if he/she is playing
			setTimeout(() => {
				if (player !== undefined && player.socket.id === socket.id) {
					// No reconnection in the ellapsed time
					this.doDisconnect(socket);
				}
			}, TIME_TO_RECONNECT);
		} else {
			this.doDisconnect(socket);
		}
	}

	doDisconnect(socket) {
		var player = this.players[socket.id];
		if (player) {
			for (let resource of this._resources) {
				resource.unregister(player);
			}
		} else {
			player = { name: 'Unknown' };
		}

		logger.log(`[Server] ${player.name} is disconnected`);
		delete this._players[socket.id];
	}

	reconnect(socket, sid) {
		var player = this.players[sid];

		// Rebind the socket to the wanted player
		this.players[socket.id] = player;
		player.socket = socket;
		delete this.players[sid];

		logger.log(`[Server] ${player.name} is reconnected`);
	}
}