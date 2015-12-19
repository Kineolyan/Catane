import * as maps from 'libs/collections/maps';
import { Reply } from 'server/com/sockets';

export class ScoreCard {
	constructor(value = 1) {
		this._value = value;
	}

	get value() {
		return this._value;
	}

	get description() {
		return { name: 'Score', value: this._value } ;
	}

	prepare() {}

	applyOn({ player }) {
		player.winPoints(this._value);

		const players = player.game.players;
		return new Reply(player)
			.all('play:score', {
				maps: maps.object(players, player => [player.id, player.score])
			});
	}
}

export default ScoreCard;