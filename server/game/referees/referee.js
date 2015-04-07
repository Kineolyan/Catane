import { shuffle } from '../../util/arrays';

const STEPS = {
	ROLL_DICE: 0,
	MOVE_THIEVES: 1,
	PLAY: 2
};

export class Referee {
	constructor(board, players) {
		this._board = board;
		this._players = shuffle(players);
		this._currentPlayerIdx = 0;

		this.startTurn();
	}

	get currentPlayer() {
		return this._players[this._currentPlayerIdx];
	}

	get players() {
		return this._players;
	}

	isTurn(player) {
		return player.id === this.currentPlayer.id;
	}

	checkTurn(player) {
		if (!this.isTurn(player)) {
			throw new Error('Not the player turn');
		}
	}

	canRollDice() {
		return this._step <= STEPS.ROLL_DICE;
	}

	rollDice(diceValue) {
		this._step = (diceValue !== 7) ? STEPS.PLAY : STEPS.MOVE_THIEVES;
	}

	moveThieves() {
		this._step = STEPS.PLAY;
	}

	endTurn() {
		if (this._step >= STEPS.PLAY) {
			this._currentPlayerIdx = (this._currentPlayerIdx + 1) % this._players.length;

			this.startTurn();
		} else {
			throw new Error('Pending actions before completing the turn. Step: ' + this._step);
		}
	}

	startTurn() {
		this._step = STEPS.ROLL_DICE;
	}
}

export default Referee;