export default class Server {
	constructor() {
		this.players = {};
	}

	connect(client) {
		this.players[client] = 1;
		client.emit('welcome', undefined);
	}

	disconnect() {}
}