import Path from 'server/catane/elements/geo/path.js';

export class AReferee {
	constructor(board, players) {
		this._board = board;
		this._players = players;
		this._currentPlayerIdx = 0;
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
	 * @param {Location} location the location to consider
	 * @returns {boolean} true if one can build the colony
	 */
	canBuildColony(location) {
		var spot = this._board.getCity(location);
		if (spot === undefined) { return false; } // No spot here

		if (spot.owner !== null) { return false; } // Already used

		var surroundingSpots = this._board.getSurroundingCities(location);
		return surroundingSpots.every(spot => spot.owner === null); // Too close from something else
	}

	/**
	 * Decides if the given location belongs the player
	 * @param  {*} element the location to check
	 * @param {BasePlayer?} player the player to check, or the current
	 *   player if undefined
	 * @return {Boolean} true for success
	 */
	belongsToPlayer(element, player) {
		if (player === undefined) { player = this.currentPlayer; }
		return element.owner !== null	&& element.owner.id === player.id;
	}

	/**
	 * Decides if the current player can build the given road.
	 * @param  {Path} askedPath path the path to build
	 * @return {boolean} true if he can build
	 */
	canBuildRoad(askedPath) {
		/* TODO improve logic to check if a road can be build
		 * This requires player to have at least one of the end.
		 * It is possible to just connect paths to each other */

		var path = this._board.getPath(askedPath);
		if (path === undefined) { return false; } // No path here

		if (path.owner !== null) { return false; } // Already used

		var ends = [ this._board.getCity(path.from), this._board.getCity(path.to) ];

		if(this.belongsToPlayer(ends[0]) || this.belongsToPlayer(ends[1])) {
			return true; // Path goes from a owned city
		}

		// None of the ends belong to the player
		for (let end of ends) {
			if (end.owner === null) { // Not belonging to another
				var surroundingPaths = this.board.getPathsFrom(end.location);
				for (let p of surroundingPaths) {
					if (p.hashCode() === path.hashCode()) { continue; }
					if (this.belongsToPlayer(p)) { return true; } // It connect to another owned path
				}
			}
		}

		// Nothing worked
		return false;
	}

	/**
	 * Decides if it is possible to build a city at a specific spot.
	 * One can build a city if the location refers to a valid
	 * colony, is owned by the current player and not already a city.
	 * @param {Location} location the location to consider
	 * @param {BasePlayer?} player the player to test
	 * @returns {boolean} true if one can build the colony
	 */
	canBuildCity(location, player) {
		if (player === undefined) { player = this.currentPlayer; }

		var spot = this._board.getCity(location);
		if (spot === undefined) { return false; } // No spot here

		if (!this.belongsToPlayer(spot, player)) { return false; } // Not owned by the player

		return !spot.isCity();
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
		super(board, players);
		this._placementIteration = 0;

		this.startTurn();
	}

	startTurn() {
		this._step = PLACEMENT_STEPS.PICK_SPOT;
		if (this._currentPlayerIdx === 0) { this._placementIteration += 1; }
	}

	/**
	 * Checks if the player can pick the city as its initial colony,
	 * @param {Location} location the location of the desired city.
	 * @throws Error if the action is not legal
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

	/**
	 * Picks a path at a given position.
	 * @param  {Location|Path} from the start location or the path
	 * @param  {Location?} to the end location or undefined
	 * @throws Error if the action is not legal
	 */
	pickPath(from, to) {
		var path = to === undefined ? from : new Path(from, to);

		if (this._step === PLACEMENT_STEPS.PICK_PATH) {
			if (this.canBuildRoad(path)) {
				this._step = PLACEMENT_STEPS.DONE;
			} else {
				throw new Error(`Cannot pick path at ${path.toString()}`);
			}
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
	DROP_RESOURCES: 1,
	MOVE_THIEVES: 2,
	PLAY: 3
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

		this.startTurn();
	}

	canRollDice() {
		return this._step <= GAME_STEPS.ROLL_DICE;
	}

	rollDice(diceValue) {
		this._step = (diceValue !== 7) ? GAME_STEPS.PLAY : GAME_STEPS.DROP_RESOURCES;
	}

	/**
	 * Notifies that the players have dropped their resources after 7.
	 * @throws Error if the action is not legal
	 */
	onResourcesDropped() {
		if (this._step === GAME_STEPS.DROP_RESOURCES) {
			this._step = GAME_STEPS.MOVE_THIEVES;
		} else {
			throw new Error(`Not the step to drop cards. Current: ${this._step}`);
		}
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

	/**
	 * Checks that the current player can settle on a colony.
	 * @param  {Location} location the colony position
	 * @throws Error if the action is not legal
	 */
	settleColony(location) {
		if (this._step === GAME_STEPS.PLAY) {
			if (!this.currentPlayer.hasResources(ResourceCosts.COLONY)) {
				throw new Error(`Not enough resources to build a colony`);
			}
			if (!this.canBuildColony(location)) {
				throw new Error(`Cannot build colony on ${location.toString()}`);
			}
		} else {
			throw new Error(`Not the correct step to settle on a colony. Current ${this._step}`);
		}
	}

	/**
	 * Checks that the current player can build a road.
	 * @param  {Path} path the path of the road
	 * @throws Error if the action is not legal
	 */
	buildRoad(path) {
		if (this._step === GAME_STEPS.PLAY) {
			if (!this.currentPlayer.hasResources(ResourceCosts.ROAD)) {
				throw new Error(`Not enough resources to build a road`);
			}
			if (!this.canBuildRoad(path)) {
				throw new Error(`Cannot build road on ${path.toString()}`);
			}
		} else {
			throw new Error(`Not the correct step to build a road. Current ${this._step}`);
		}
	}

	/**
	 * Checks that the current player can build a city.
	 * @param  {Location} location the city position
	 * @throws Error if the action is not legal
	 */
	buildCity(location) {
		if (this._step === GAME_STEPS.PLAY) {
			if (!this.currentPlayer.hasResources(ResourceCosts.CITY)) {
				throw new Error(`Not enough resources to build a city`);
			}
			if (!this.canBuildCity(location)) {
				throw new Error(`Cannot build city on ${location.toString()}`);
			}
		} else {
			throw new Error(`Not the correct step to settle on a city. Current ${this._step}`);
		}
	}

	/**
	 * Checks if the current player can convert some resources
	 * @param {String} type type of the resources to convert
	 * @param {Number} quantity the number of resources to convert
	 * @throws Error if the action is not legal
	 */
	convertResources(type, quantity) {
		if (this._step === GAME_STEPS.PLAY) {
			var wantedResources = {};
			wantedResources[type] = quantity;

			if (!this.currentPlayer.hasResources(wantedResources)) {
				throw new Error(`Not enough resources to convert`);
			}
		} else {
			throw new Error(`Not the correct step to convert resources. Current ${this._step}`);
		}
	}

	/**
	 * Exchanges resources between two players.
	 * @param {BasePlayer} otherPlayer the player receiving resources
	 * @param {Object} givenResources the resources given in the exchange
	 * @param {Object} gottenResources the resources obtained in the exchange
	 * @throws Error if the action is not legal
	 */
	exchangeResources(otherPlayer, givenResources, gottenResources) {
		if (this._step === GAME_STEPS.PLAY) {
			if (Object.keys(givenResources).length === 0) {
				throw new Error(`Cannot exchange without giving resources`);
			}
			if (Object.keys(gottenResources).length === 0) {
				throw new Error(`Cannot exchange without receiving resources`);
			}
			if (!this.currentPlayer.hasResources(givenResources)) {
				throw new Error(`Not enough resources to give`);
			}
			if (!otherPlayer.hasResources(gottenResources)) {
				throw new Error(`Not enough resources to receive`);
			}
		} else {
			throw new Error(`Not the correct step to exchange resources. Current ${this._step}`);
		}
	}

	buyCard() {
		if (this._step === GAME_STEPS.PLAY) {
			if (!this.currentPlayer.hasResources(ResourceCosts.CARD)) {
				throw new Error(`Not enough resources to build a card`);
			}
		} else {
			throw new Error(`Not the correct step to settle on a card. Current ${this._step}`);
		}
	}

	startTurn() {
		this._step = GAME_STEPS.ROLL_DICE;
	}

	hasRemainingRequiredActions() {
		return this._step < GAME_STEPS.PLAY;
	}
}