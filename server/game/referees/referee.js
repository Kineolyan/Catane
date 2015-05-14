import * as maps from '../../util/maps.js';

export class AReferee {
	constructor(board, players) {
		this._board = board;
		this._players = players;
		this._currentPlayerIdx = 0;

		this.startTurn();
	}

	get currentPlayer() {
		return this._players[this._currentPlayerIdx];
	}

	get players() {
		return this._players;
	}

	get board() {
		return this._board;
	}

	isTurn(player) {
		return player.id === this.currentPlayer.id;
	}

	checkTurn(player) {
		if (!this.isTurn(player)) {
			throw new Error(`Not player ${player.id} turn (${this.currentPlayer.id})`);
		}
	}

	/**
	 * Decides if it is possible to build a colony at a specific spot.
	 * One can build a colony if the location refers to a valid
	 * spot, is not already owned and is not too close from
	 * other colonies or cities.
	 * @param location the location to consider
	 * @returns {boolean} true if one can build the colony
	 */
	canBuildColony(location) {
		var spot = this._board.getCity(location);
		if (spot === undefined) { return false; } // No spot here

		if (spot.owner !== null) { return false; } // Already used

		var surroundingSpots = this._board.getSurroundingCities(location);
		return surroundingSpots.every(spot => spot.owner === null); // Too close from something else
	}

	endTurn() {
		if (!this.hasRemainingRequiredActions()) {
			this._currentPlayerIdx = (this._currentPlayerIdx + 1) % this._players.length;

			this.startTurn();
		} else {
			throw new Error('Pending actions before completing the turn. Step: ' + this._step);
		}
	}
}

const PLACEMENT_STEPS = {
	PICK_SPOT: 0,
	PICK_PATH: 1,
	DONE: 2
};

export class PlacementReferee extends AReferee {
	constructor(board, players) {
		this._placementIteration = 0;
		super(board, players);
	}

	startTurn() {
		this._step = PLACEMENT_STEPS.PICK_SPOT;
		if (this._currentPlayerIdx === 0) { this._placementIteration += 1; }
	}

	/**
	 * Checks if the player can pick the city as its initial colony,
	 * @param location the location of the desired city.
	 */
	pickColony(location) {
		if (this._step === PLACEMENT_STEPS.PICK_SPOT) {
			if (this.canBuildColony(location)) {
				this._step = PLACEMENT_STEPS.PICK_PATH;
			} else {
				throw new Error(`Cannot pick city at ${location.toString()}`);
			}
		} else {
			throw new Error(`Cannot pick city. Current step: ${this._step}`);
		}
	}

	pickPath() {
		if (this._step === PLACEMENT_STEPS.PICK_PATH) {
			this._step = PLACEMENT_STEPS.DONE;
		} else {
			throw new Error(`Cannot pick path. Current step ${this._step}`);
		}
	}

	hasRemainingRequiredActions() {
		return this._step < PLACEMENT_STEPS.DONE;
	}

	isPlacementComplete() {
		return this._placementIteration >= 3;
	}
}

const GAME_STEPS = {
	ROLL_DICE: 0,
	MOVE_THIEVES: 1,
	PLAY: 2
};

export const ResourceCosts = {
	COLONY: { tuile: 1, bois: 1, mouton: 1, ble: 1 },
	CITY: { caillou: 3, ble: 2 },
	ROAD: { tuile: 1, bois: 1 },
	CARD: { caillou: 1, mouton: 1, ble: 1 }
};

export class GameReferee extends AReferee {
	constructor(board, players) {
		super(board, players);
	}

	canRollDice() {
		return this._step <= GAME_STEPS.ROLL_DICE;
	}

	rollDice(diceValue) {
		this._step = (diceValue !== 7) ? GAME_STEPS.PLAY : GAME_STEPS.MOVE_THIEVES;
	}

	moveThieves(tileLocation) {
		if (this._step === GAME_STEPS.MOVE_THIEVES || this._step === GAME_STEPS.PLAY) {
			if (this._board.getTile(tileLocation) === undefined) {
				throw new Error(`Location ${tileLocation.toString()} does not refer to a tile`);
			}
			if (this._board.thieves.hashCode() === tileLocation.hashCode()) {
				throw new Error(`Thieves already on ${tileLocation.toString()}`);
			}

			this._step = GAME_STEPS.PLAY;
		} else {
			throw new Error(`Not the correct step to move thieves. Current ${this._step}`);
		}
	}

	settleColony(location) {
		if (this._step === GAME_STEPS.PLAY) {
			if (!this.canBuildColony(location)) {
				throw new Error(`Cannot build colony on ${location.toString()}`);
			}
			if (!this.hasEnoughResources(this.currentPlayer, ResourceCosts.COLONY)) {
				throw new Error(`Not enough resources to build a colony`);
			}
		} else {
			throw new Error(`Not the correct step to settle on a colony. Current ${this._step}`);
		}
	}

	startTurn() {
		this._step = GAME_STEPS.ROLL_DICE;
	}

	hasRemainingRequiredActions() {
		return this._step <+ GAME_STEPS.PLAY;
	}

	/**
	 * Decides if the given player has enough resources to
	 * comply the given cost.
	 * @param  {Player}  player the player to check
	 * @param  {Object}  costs   the cost of the operation
	 * @return {Boolean} true if everything is ok
	 */
	hasEnoughResources(player, costs) {
		var resources = player.resources;
		for (let [r, cost] of maps.entries(costs)) {
			let quantity = resources[r] || 0;
			if (quantity < cost) { return false; }
		}
		return true;
	}
}