import Player from './game/players/players';

export default class Server {
	constructor() {
		this._players = {};
		this._nextPlayerId = 0;
	}

	get players() {
		return this._players;
	}

	connect(client) {
		var player = new Player(client, (++this._nextPlayerId).toString());
		this.players[client] = player;
		client.emit('std', { message: 'welcome', name: player.name, id: player.id });
	}

	disconnect(client) {}
}