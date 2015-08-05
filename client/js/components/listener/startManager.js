import Immutable from 'immutable';

import Globals from 'client/js/components/libs/globals';
import { Step, Interface } from 'client/js/components/libs/globals';
import Manager from 'client/js/components/listener/manager';
import { BoardBinding } from 'client/js/components/common/map';
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
		this.listenToSocket(Globals.socket.gamePlayers, this.updatePlayerList.bind(this));
		this.listenToSocket(Globals.socket.playerNickname, this.updatePlayerNickname.bind(this));
		this.listenToSocket(Globals.socket.gameStart, this.startGame.bind(this));
		this.listenToSocket(Globals.socket.gameQuit, this.quitGame.bind(this));
		this.listenToSocket(Globals.socket.gameCreate, this.gameCreate.bind(this));
		this.listenToSocket(Globals.socket.gameList, this.updateGameList.bind(this));
		this.listenToSocket(Globals.socket.gameJoin, this.gameJoin.bind(this));
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
	startGame({ board: board, players: playerIds }) {
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
}

	/**
	 * Leave the current game
	 */
	quitGame() {
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
	 * Create a new game
	 * @param  {Object} game: game The created game
	 */
	gameCreate({ game: game }) {
		this._binding.set('start.gameChosen', Immutable.fromJS(game));
	}

	/**
	 * Update the list of availables games
	 * @param  {Object} games: games All the availables games
	 */
	updateGameList({ games: games }) {
		this._binding.set('start.games', Immutable.fromJS(games));
	}

	/**
	 * Join a game
	 */
	gameJoin({ id: gameId }) {
		var games = this._binding.get('start.games');
		var joinedGame = games.filter(game => game.get('id') === gameId).toJS()[0];
		this._binding.set('start.gameChosen', Immutable.fromJS(joinedGame));
	}
}
