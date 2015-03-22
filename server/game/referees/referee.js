import { shuffle } from '../../util/arrays';

const STEPS = {
	ROLL_DICE: 0,
	MOVE_THIEFS: 1,
	PLAY: 2
};

export class Referee {
	constructor(board, players) {
		this._board = board;
		console.log
		this._players = shuffle(players);
		this._currentPlayerIdx = 0;

		this.startTurn();
	}

	get currentPlayer() {
		return this._players[this._currentPlayerIdx];
	}

	isTurn(player) {
		return player.id === this.currentPlayer.id;
	}

	canRollDice() {
		return this._step <= STEPS.ROLL_DICE;
	}

	rollDice(diceValue) {
		this._step = (diceValue !== 7) ? STEPS.PLAY : STEPS.MOVE_THIEFS;
	}

	endTurn() {
		this._currentPlayerIdx = (this._currentPlayerIdx + 1) % this._players.length;

		this.startTurn();
	}

	startTurn() {
		this._step = STEPS.ROLL_DICE;
	}
}

export default Referee;