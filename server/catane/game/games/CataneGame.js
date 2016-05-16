import Board from 'server/catane/elements/boards/board';
import { RoundGenerator } from 'server/catane/elements/boards/generators/maps';
import Dice from 'server/catane/elements/dice/dice';
import { PlacementReferee, GameReferee, ResourceCosts } from 'server/catane/game/referees/referee';
import { DropResourcesDelegate } from 'server/catane/game/referees/delegates.js';
import { CardGenerator } from 'server/catane/elements/cards/generator';
import CatanePlayer from 'server/catane/game/players/CatanePlayer.js';

import { Reply } from 'server/core/com/sockets.js';
import AGame from 'server/core/game/games/AGame';

import { shuffle } from 'libs/collections/arrays';
import _ from 'lodash';

const logger = global.logger;

export default class CataneGame extends AGame {
	/**
	 * Constructor
	 * @param  {Object} id player's id
	 */
	constructor(id) {
		super(id, 2, 4);
		this._cardGenerator = new CardGenerator();
	}

	/**
	 * Picks a city for a player.
	 * @param {BasePlayer} player the player wanting the location
	 * @param {Location} location the location of the desired city
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
	 * @param {BasePlayer} player the player wanting the path
	 * @param {Path} path the path desired
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

			var total = values[0] + values[1];
			if (total === 7) {
				let delegate = new DropResourcesDelegate(this._referee);

				if (!delegate.allResourcesDropped()) {
					this._referee = delegate;
					this.emit('game:action', { action: 'drop resources', remaining: delegate.remainingList });
				} else {
					this._referee.onResourcesDropped();
					this.emit('game:action', { action: 'move thieves' });
				}
			} else {
				// Distribute the resources to players
				var affectedTiles = this._board.getTilesForDice(total, true);
				for (let tile of affectedTiles) { tile.distributeResources(); }

				this.emit('game:action', { action: 'play' });
			}

			return values;
		} else {
			throw new Error('Dice already rolled');
		}
	}

	/**
	 * Drops the resources of the player.
	 * @param {BasePlayer} player the player dropping items
	 * @param {Object} resources the map of resources to drop
	 * @return {Number} the count of remaining resources to drop
	 */
	dropResources(player, resources) {
		var remaining = this._referee.dropResources(player, resources);
		if (this._referee.allResourcesDropped()) {
			// Restore the initial referee from the delegate
			this._referee = this._referee.referee;
			this._referee.onResourcesDropped();
			this.emit('game:action', { action: 'move thieves' });
		} else {
			this.emit('game:action', { action: 'drop resources', remaining: this._referee.remainingList });
		}

		return remaining;
	}

	/**
	 * Moves the thieves to a new tile.
	 * @param {BasePlayer} player the player executing the move
	 * @param {Location} tileLocation the new location for thieves
	 */
	moveThieves(player, tileLocation) {
		this._referee.checkTurn(player);
		this._referee.moveThieves(tileLocation);
		this._board.thieves = tileLocation;
	}

	/**
	 * Creates a new colony at the given location.
	 * @param {BasePlayer} player the player executing the action
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
	 * @param  {BasePlayer} player the player executing the action
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
	 * @param {BasePlayer} player the player executing the action
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
	 * Converts 4 player resources of type from into 1 resource of type to
	 * @param {BasePlayer} player the player executing the action
	 * @param {String} from the type of resources to use
	 * @param {String} to the type of resources to create
	 */
	convertResources(player, from, to) {
		this._referee.checkTurn(player);
		this._referee.convertResources(from, 4);

		var usedResources = {};
		usedResources[from] = 4;
		player.useResources(usedResources);
		player.receiveResources([to]);
	}

	/**
	 * Exchanges resources between two players.
	 * @param {BasePlayer} player the player giving resources
	 * @param {BasePlayer} otherPlayer the player receiving resources
	 * @param {Object} givenResources the resources given in the exchange
	 * @param {Object} gottenResources the resources obtained in the exchange
	 */
	exchangeResources(player, otherPlayer, givenResources, gottenResources) {
		this._referee.checkTurn(player);
		this._referee.exchangeResources(otherPlayer, givenResources, gottenResources);

		player.useResources(givenResources);
		otherPlayer.receiveResources(givenResources);

		otherPlayer.useResources(gottenResources);
		player.receiveResources(gottenResources);
	}

	/**
	 * Buys a card for a player.
	 * @param {BasePlayer} player instance of player
	 * @returns {Reply} result of the buy action
	 */
	buyCard(player) {
		this._referee.checkTurn(player);
		this._referee.buyCard(player);

		const newCard = this._cardGenerator.generate();
		player.addCard(newCard);

		const reply = new Reply(player)
			.emit({ cards: _.mapValues(player.cards, 'description') })
			.others({ player: player.id, cards: _.size(player.cards) });
		return reply;
	}

	/**
	 * Plays a card from the player hand.
	 * @param {BasePlayer} player the player executing the action
	 * @param {String} cardId id of the card to play
	 * @param {Object} args arguments for card execution
	 * @return {Reply} card execution reply
	 */
	playCard(player, cardId, args) {
		this._referee.checkTurn(player);
		return player.useCard(cardId, args);
	}

	/**
	 * Makes the player end its turn.
	 * @param {BasePlayer} player the player ending its turn
	 * @returns {BasePlayer} the next player whose turn has started
	 */
	endTurn(player) {
		this._referee.checkTurn(player);
		this._referee.endTurn();
		if (this._prepared === false && this._referee.isPlacementComplete()) {
			this._prepared = true;
			this.initiateGame();

			// Send their resources to all players.
			this._players.forEach(player => {
				player.emit('game:play', { resources: player.resources });
			});
		}

		return this._referee.currentPlayer;
	}

	doStart() {
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
	 * Reloads the game for the client.
	 * This gets the description of the game.
	 * @return {Object} the description of the current game.
	 */
	reload() {
		var orderedPlayers = this._referee.players.map(player => player.toJson());
		return {
			board: this._board.toJson(),
			players: orderedPlayers,
			currentPlayer: this._referee.currentPlayer.id
		};
	}

	/**
	 * Generates the play by creating all elements: dice,
	 * 	board, ...
	 * @return {Object} a description of the board
	 */
	generatePlay() {
		this._board = new Board();
		this._board.generate(new RoundGenerator(3));

		return this._board.toJson();
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

	createGamePlayer(corePlayer) {
		return new CatanePlayer(corePlayer);
	}
}