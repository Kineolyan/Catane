import AGame from 'server/core/game/games/AGame';

export class SewenGame extends AGame {
	constructor(id) {
		super(id, 2, 7);
		this._hands = [];
	}

	doStart() {
		// TODO generate hands
	}
}

export default SewenGame;