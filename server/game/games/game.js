import Board from '../../elements/boards/board';
import { RoundGenerator } from '../../elements/boards/generators/maps';
import Dice from '../../elements/dice/dice';
import { PlacementReferee, GameReferee, ResourceCosts } from '../referees/referee';
import { shuffle } from '../../util/arrays';

const logger = global.logger;

export default class Game {
	/**
	 * Constructor
	 * @param  {Object} id player's id
	 */
	constructor(id) {
		this._id = id;
		this._players = new Set();
		this._started = false;
	}

	/**
	 * Gets the id of the player
	 * @return {Integer} player's id
	 */
	get id() {
		return this._id;
	}

	/**
	 * Gets the list of players
	 * @return {Set} the game's player
	 */
	get players() {
		return this._players;
	}

	/**
	 * Adds a new player to the game.
	 * @param {Player} player the player to add
	 * @return {boolean} true if the player is added, false if it was already
	 *   present.
	 */
	add(player) {
		if (!this._players.has(player)) {
			this._players.add(player);
			player.game = this;
			return true;
		} else {
			return false;
		}
	}

	remove(player) {
		if (this._players.has(player)) {
			this._players.delete(player);
			player.game = undefined;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Picks a city for a player.
	 * @param player the player wanting the location
	 * @param location the location of the desired city
	 * @return {City} the picked colony
	 * @throws if the rules prevent this operation
	 */
	pickColony(player, location) {
		this._referee.checkTurn(player);
		this._referee.pickColony(location);

		// Assign the colony
		var pickedColony = this._board.getCity(location);
		pickedColony.owner = player;

		// Provide the resources
		var reachedTiles = this._board.getSurroundingTiles(location);
		player.receiveResources(reachedTiles.map(tile => tile.resource));

		return pickedColony;
	}

	/**
	 * Picks a path for a player.
	 * @param player the player wanting the path
	 * @param path the path desired
	 * @return {Path} the picked path
	 * @throws if the rules prevent this operation
	 */
	pickPath(player, path) {
		this._referee.checkTurn(player);
		this._referee.pickPath(path);

		var pickedPath = this._board.getPath(path);
		pickedPath.owner = player;

		return pickedPath;
	}

	rollDice(player) {
		this._referee.checkTurn(player);
		if (this._referee.canRollDice(player)) {
			var values = [ this._dice.roll(), this._dice.roll() ];
			this._referee.rollDice(values[0] + values[1]);

			// Distribute the resources to players
			var total = values[0] + values[1];
			var affectedTiles = this._board.getTilesForDice(total, true);
			for (let tile of affectedTiles) { tile.distributeResources(); }

			return values;
		} else {
			throw new Error('Dice already rolled');
		}
	}

	/**
	 * Moves the thieves to a new tile.
	 * @param player the player executing the move
	 * @param tileLocation the new location for thieves
	 */
	moveThieves(player, tileLocation) {
		this._referee.checkTurn(player);
		this._referee.moveThieves(tileLocation);
		this._board.thieves = tileLocation;
	}

	/**
	 * Creates a new colony at the given location.
	 * @param player the player executing the action
	 * @param  {Location} location the new location
	 * @return {City} the picked colony
	 */
	settleColony(player, location) {
		this._referee.checkTurn(player);
		this._referee.settleColony(location);

		// Assign the colony
		var pickedColony = this._board.getCity(location);
		pickedColony.owner = player;
		player.useResources(ResourceCosts.COLONY);

		return pickedColony;
	}

	/**
	 * Builds a road at a given path location.
	 * @param  {Player} player the player executing the action
	 * @param  {Path} path   the path to pick
	 * @return {Path} the build path
	 */
	buildRoad(player, path) {
		this._referee.checkTurn(player);
		this._referee.buildRoad(path);

		// Assign the path to the player
		var pickedPath = this._board.getPath(path);
		pickedPath.owner = player;
		player.useResources(ResourceCosts.ROAD);

		return pickedPath;
	}

	/**
	 * Evolves the colony into city at the given location.
	 * @param player the player executing the action
	 * @param  {Location} location the colony location
	 * @return {City} the built city
	 */
	buildCity(player, location) {
		this._referee.checkTurn(player);
		this._referee.buildCity(location);

		// Evolve the colony
		var city = this._board.getCity(location);
		city.evolve();
		player.useResources(ResourceCosts.CITY);

		return city;
	}

	/**
	 * Makes the player end its turn.
	 * @param player the player ending its turn
	 * @returns the next player whose turn has started
	 */
	endTurn(player) {
		this._referee.checkTurn(player);
		this._referee.endTurn();
		if (this._prepared === false && this._referee.isPlacementComplete()) {
			this._prepared = true;
			this.initiateGame();
			this.emit('game:play');
		}

		return this._referee.currentPlayer;
	}

	/**
	 * Emits the message on the channel to all players of the game.
	 * @param {Player=} player the current player, defined to exclude the player for the broadcast.
	 * @param {String} channel name of the event
	 * @param {Object=} message message to send
	 */
	emit(player, channel, message) {
		var excludedId;
		if (typeof player === 'string') {
			// It does not define any player
			message = channel;
			channel = player;
			excludedId = -1;
		} else {
			excludedId = player.id;
		}

		this._players.forEach(player => {
			if (player.id !== excludedId) { player.emit(channel, message); }
		});
	}

	start() {
		if (this._started) { throw new Error(`Game ${this._id} already started`); }
		if (this._players.size < 2) { throw new Error(`Not enough players in the game (${this._players.size})`); }

		this._started = true;
		logger.info(`Game ${this.id} starting ...`);

		var boardDescription = this.generatePlay();
		var playerOrder = this.prepareGame();

		this.emit('game:start', {
			_success: true,
			board: boardDescription,
			players: playerOrder
		});
		this.emit('game:prepare');
		this.emit('play:turn:new', { player: this._referee.currentPlayer.id });
	}

	/**
	 * Generates the play by creating all elements: dice,
	 * 	board, ...
	 * @return {Object} a description of the board
	 */
	generatePlay() {
		this._board = new Board();
		this._board.generate(new RoundGenerator(3));

		var description = { tiles: [], cities: [], paths: [] };
		for (let tile of this._board.tiles) {
			description.tiles.push({
				x: tile.location.x,
				y: tile.location.y,
				resource: tile.resource,
				diceValue: tile.diceValue
			});
		}
		for (let city of this._board.cities) {
			description.cities.push({
				x: city.location.x,
				y: city.location.y
			});
		}
		for (let path of this._board.paths) {
			description.paths.push({
				from: { x: path.from.x, y: path.from.y },
				to: { x: path.to.x, y: path.to.y }
			});
		}

		return description;
	}

	/**
	 * Prepares the game.
	 * This will create a referee monitoring the placement of the players, the
	 * distribution of the spots and roads.
	 * @return {Array} the ids of the players in order of play
	 */
	prepareGame() {
		this._referee = new PlacementReferee(this._board, shuffle(this._players));
		this._prepared = false;

		logger.info(`Preparing game ${this.id} ...`);
		return this._referee.players.map(player => player.id);
	}

	/**
	 * Initiates the game.
	 * It will create a referee to monitor the game and order the
	 * 	players.
	 */
	initiateGame() {
		this._dice = new Dice(6);
		var previousReferee = this._referee;
		this._referee = new GameReferee(previousReferee.board, previousReferee.players);

		// TODO send to each player their resources

		logger.info(`Game ${this.id} prepared and running !`);
	}
}