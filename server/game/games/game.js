export default class Game {
	constructor(id) {
		this._id = id;
		this._players = new Set();
	}

	get id() {
		return this._id;
	}

	get players() {
		return this._players;
	}

	add(player) {
		if (!this._players.has(player)) {
			this._players.add(player);
			return true;
		} else {
			return false;
		}
	}

	emit(channel, message) {
		this._players.forEach(player => player.emit(channel, message));
	}
}