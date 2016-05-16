import Immutable from 'immutable';

import { Channel } from 'client/js/components/libs/socket';
import Manager from 'client/js/components/listener/manager';
import { PlayersBinding } from 'client/js/components/common/players';

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
		this._socket.emit(Channel.gameCreate, { game: 'catane' });
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
