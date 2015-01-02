import Player from './game/players/players';
import Games from './game/games';

export default class Server {
	constructor() {
		this._players = {};
		this._nextPlayerId = (function() {
			var i = 0;
			return function() {
				i += 1;
				return i.toString();
			};
		})();

		this._resources = [
			new Games()
		];
	}

	get players() {
		return this._players;
	}

  /**
   * Connects a client to the server.
   * @param  {Socket} socket with client connection
   */
	connect(client) {
		var player = new Player(client, this._nextPlayerId());
		this.players[client] = player;
		console.log(`[Server] ${player.name} is connected`);
		client.emit('init', { message: 'welcome', name: player.name, id: player.id });

		for (let resource of this._resources) {
			resource.register(client);
		}
	}

	disconnect(client) {
		var player = this.players[client] || { name: 'Unknown' };

		console.log(`[Server] ${player.name} is disconnected`);
		delete this._players[client];
	}
}
