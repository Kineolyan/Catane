import Immutable from 'immutable';

import { Step, Interface } from 'client/js/components/libs/globals';
import { Channel } from 'client/js/components/libs/socket';
import Manager from 'client/js/components/listener/manager';
import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';
import LocalStorage from 'client/js/components/libs/localStorage';

var localStorage = new LocalStorage();

/**
 * Manager for the starting part
 * @class
 */
export default class StartManager extends Manager {

	/**
	 * Start listening
	 */
	startListen() {
		this.listenToSocket(Channel.gamePlayers, this.updatePlayerList.bind(this));
		this.listenToSocket(Channel.playerNickname, this.updatePlayerNickname.bind(this));
		this.listenToSocket(Channel.gameStart, this.onGameStart.bind(this));
		this.listenToSocket(Channel.gameQuit, this.onGameQuit.bind(this));
		this.listenToSocket(Channel.gameCreate, this.gameCreate.bind(this));
		this.listenToSocket(Channel.gameList, this.updateGameList.bind(this));
		this.listenToSocket(Channel.gameJoin, this.gameJoin.bind(this));
	}

	/**
	 * Update the player in the game
	 * @param  {Array} newPlayers list of players as {id, name}
	 */
	updatePlayerList({ players: newPlayers }) {
		var myId = this._binding.get('me.id');
		var playersBinding = this._binding.get('players').withMutations(binding => {
			var players = new PlayersBinding(binding);

			// delete the players
			players.deleteAll();

			// re-create a new list
			newPlayers.forEach((player) => {
				if (player.id === myId) {
					players.setIPlayer(player.id, player.name);
				} else {
					players.setPlayer(player.id, player.name);
				}
			});
		});

		// save
		this._binding.set('players', playersBinding);
	}

	/**
	 * Sets the name of the player.
	 * @param {String} name the new player name
	 */
	setName(name) {
		this._socket.emit(Channel.playerNickname, name);
	}

	/**
	 * Update the name of one player
	 * @param  {Object} newPlayer The player with the new name
	 */
	updatePlayerNickname({ player: newPlayer }) {
		var players = PlayersBinding.from(this._binding);
		players.updatePlayer(newPlayer.id, newPlayer);

		this._binding.set('players', players.binding);
	}

	/**
	 * Start the game with a board
	 * @param {Object} board The original board
	 * @param {Array} playerIds the ids of the players in play order
	 */
	onGameStart({ board: board, players: playerIds }) {
		var colors = Interface.player.colors;

		// Order players
		var players = this._binding.get('players');
		var orderMap = {};
		playerIds.forEach((id, index) => orderMap[id] = index);
		var sortedPlayers = players.sortBy((player) => orderMap[player.get('id')])
			.map((player, i) => player.set('color', colors[i]));

		// Create the board
		var boardBinding = BoardBinding.from(this._binding);
		boardBinding.buildBoard(board);

		this._binding.atomically()
			.set('players', sortedPlayers)
			.set('step', Step.prepare)
			.set('game.board', boardBinding.binding)
			.commit();

		// Save the game in local storage to be able to reload it
		localStorage.set('server', this._binding.get('server').toJS());
	}

	/**
	 * Leave the current game
	 */
	onGameQuit() {
		var players = new PlayersBinding(this._binding.get('players'));
		// delete the others players
		players.deleteOthers();

		// reset the selection
		this._binding.atomically()
				.set('start.gameChosen', Immutable.fromJS({}))
				.set('players', players.binding)
				.commit();
	}

	/**
	 * Asks for a new game to be created.
	 * @see #gameCreate for answer
	 */
	createGame() {
		this._socket.emit(Channel.gameCreate);
	}

	/**
	 * Create a new game
	 * @param  {Object} game: game The created game
	 */
	gameCreate({ game: game }) {
		this._binding.set('start.gameChosen', Immutable.fromJS(game));
	}

	/**
	 * Requests for the list of games to be send.
	 */
	askGameList() {
		this._socket.emit(Channel.gameList);
	}

	/**
	 * Update the list of availables games
	 * @param  {Object} games: games All the availables games
	 */
	updateGameList({ games: games }) {
		this._binding.set('start.games', Immutable.fromJS(games));
	}

	/**
	 * Requests that the player joins a given game
	 * @param  {Number} gameId the id of the game
	 */
	joinGame(gameId) {
		this._socket.emit(Channel.gameJoin, gameId);
	}

	/**
	 * Join a game
	 */
	gameJoin({ id: gameId }) {
		var games = this._binding.get('start.games');
		var joinedGame = games.filter(game => game.get('id') === gameId).toJS()[0];
		this._binding.set('start.gameChosen', Immutable.fromJS(joinedGame));
	}

	/**
	 * Requests that a given game start.
	 * @param  {Number} gameId the id of the game to start
	 */
	startGame(gameId) {
		this._socket.emit(Channel.gameStart, gameId);
	}

	quitGame() {
		this._socket.emit(Channel.gameQuit);
	}
}
