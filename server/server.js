import Player from './game/players/players';
import Games from './game/games/games';
import { idGenerator } from './game/util';

export default class Server {
	constructor() {
		this._players = {};
		this._nextPlayerId = idGenerator();

		this._resources = [
			new Games()
		];
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
		this.players[socket] = player;
		console.log(`[Server] ${player.name} is connected`);
		socket.emit('init', { message: 'welcome', name: player.name, id: player.id });

		for (let resource of this._resources) {
			resource.register(player);
		}
	}

	disconnect(socket) {
		var player = this.players[socket] || { name: 'Unknown' };

		console.log(`[Server] ${player.name} is disconnected`);
		delete this._players[socket];
	}
}
