import Player from './game/players/players';

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
  }

	disconnect(client) {
		var player = this.players[client] || { name: 'Unknown' };

		console.log(`[Server] ${player.name} is disconnected`);
		delete this._players[client];
	}
}