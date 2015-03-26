import Board from '../../elements/boards/board';
import { RoundGenerator } from '../../elements/boards/generators/maps';
import Dice from '../../elements/dice/dice';
import Referee from '../referees/referee';

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

	rollDice(player) {
		if (this.referee.isTurn(player)) {
			if (this.referee.canRollDice(player)) {
				return [ this._dice.roll(), this._dice.roll() ];
			} else {
				throw new Error('Dice already rolled');
			}
		} else {
			throw new Error('Not the player turn');
		}
	}

	endTurn(player) {
		if (this._referee.isTurn(player)) {
			this._referee.endTurn();

			return this._referee.currentPlayer;
		} else {
			throw new Error('Not the player turn');
		}
	}

	/**
	 * Emits the message on the channel to all players of the game.
	 * @param  {String} channel name of the event
	 * @param  {Object} message message to send
	 */
	emit(channel, message) {
		this._players.forEach(player => player.emit(channel, message));
	}

	start() {
		if (this._started) { throw new Error(`Game ${this._id} already started`); }
		if (this._players.size < 2) { throw new Error(`Not enough players in the game (${this._players.size})`); }

		this._started = true;

		var boardDescription = this.generatePlay();
		var playerOrder = this.initiateGame();

		this.emit('game:start', {
			_success: true,
			board: boardDescription,
			players: playerOrder
		});
		this.emit('play:turn:new', { player: this._referee.currentPlayer.id });
	}

	/**
	 * Generates the play by creating all elements: dice,
	 * 	board, ...
	 * @return {Object} a description of the board
	 */
	generatePlay() {
		this._dices = new Dice(6);
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
				y: city.location.y,
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
	 * Initiates the game.
	 * It will create a referee to monitor the game and order the
	 * 	players.
	 * @return {Array} the ids of the players in order of play
	 */
	initiateGame() {
		this._referee = new Referee(this._board, this._players);

		return this._referee.players.map(player => player.id);
	}
}