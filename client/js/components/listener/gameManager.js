import Immutable from 'immutable';

import Globals from 'client/js/components/libs/globals';
import { Step, Interface } from 'client/js/components/libs/globals';
import Manager from 'client/js/components/listener/manager';
import { Channel } from 'client/js/components/libs/socket';
import { PlayersBinding, MyBinding } from 'client/js/components/common/players';
import { BoardBinding } from 'client/js/components/common/map';
import LocalStorage from 'client/js/components/libs/localStorage';

const localStorage = new LocalStorage();

export default class GameManager extends Manager {

	startListen() {
		this.listenToSocket(Channel.reconnect, this.onReconnection.bind(this));

		this.listenToSocket(Channel.gameStart, this.onGameStart.bind(this));
		this.listenToSocket(Channel.gamePrepare, this.gamePrepare.bind(this));
		this.listenToSocket(Channel.gamePlay, this.launchGame.bind(this));
		this.listenToSocket(Channel.gameReload, this.onGameReload.bind(this));

		this.listenToSocket(Channel.playTurnNew, this.playTurnNew.bind(this));
		this.listenToSocket(Channel.mapDice, this.rollDice.bind(this));
		this.listenToSocket(Channel.playPickColony, this.playPickElement.bind(this));
		this.listenToSocket(Channel.playPickPath, this.playPickElement.bind(this));
		this.listenToSocket(Channel.playMoveThieves, this.onThievesMove.bind(this));
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
	 * Reconnects a player to an existing session.
	 * @param {Number} sessionId session id
	 */
	reconnect(sessionId) {
		this._socket.emit(Channel.reconnect, sessionId);
	}

	onReconnection({ player: player }) {
		/* Only update the player id. The rest will be updated by
		 * game reloading */
		this._binding.set('me.id', player.id);
		// Save the current server info with the new socket id
		localStorage.set('server', this._binding.get('server').toJS());
		this.reloadGame();
	}

	/**
	 * Asks for the game to be reloaded from the server.
	 */
	reloadGame() {
		this._socket.emit(Channel.gameReload);
	}

	onGameReload({ board: board, players: players, currentPlayer: currentPlayer, me: myInfo }) {
		var colors = Interface.player.colors;
		var transaction = this._binding.atomically();

		// Set my information
		var myBinding = MyBinding.from(this._binding);
		myBinding.setCards(myInfo.resources);
		var myId = myBinding.id;
		myBinding.save(transaction);

		// Order players
		var playersBinding = PlayersBinding.from(this._binding);
		playersBinding.deleteAll();
		players.forEach((player, i) => {
			if (player.id === myId) {
				playersBinding.setIPlayer(player.id, player.name, colors[i]);
			} else {
				playersBinding.setPlayer(player.id, player.name, colors[i]);
			}
		});
		playersBinding.save(transaction);

		// Create the board
		var boardBinding = BoardBinding.from(this._binding);
		boardBinding.buildBoard(board);
		boardBinding.save(transaction);

		transaction
			.set('step', Step.started) // TODO which step it is ?
			.set('game.currentPlayerId', currentPlayer)
			.commit();
	}

	selectCity(city) {
		this._socket.emit(Channel.playPickColony, { colony: city });
	}

	selectPath(path) {
		this._socket.emit(Channel.playPickPath, { path: path });
	}

	/**
	 * A player picked something on the map
	 * @param {Object} res result of the picking
	 */
	playPickElement(res) {
		if (this._binding.get('step') === Step.prepare) {
			// get the map
			var players = new PlayersBinding(this._binding.get('players'));
			var boardBinding = BoardBinding.from(this._binding);
			var player = players.getPlayer(res.player);

			var type;
			var payload;
			// choose what to do
			if (res.colony) {
				type = 'cities';
				payload = res.colony;
				boardBinding.setSelectable('paths', true, BoardBinding.emptyElement);
			} else if (res.path) {
				type = 'paths';
				payload = res.path;
				boardBinding.setSelectable('paths', false);
			}

			// give an element to a player
			boardBinding.giveElement(type, payload, player);

			// For me, complete the turn after selecting the path
			if (res.path) {
				let myBinding = MyBinding.from(this._binding);
				if (myBinding.binding.get('id') === res.player) {
					this.endTurn();
				}
			}
			boardBinding.save(this._binding);
		} else {
			throw new Error('Not the good step');
		}
	}

	/**
	 * Roll the dice
	 * @param {Array} dice dice values picked
	 */
	rollDice({ dice: dice, resources: resources }) {
		this._binding.atomically()
				.set('game.dice.values', Immutable.fromJS(dice))
				.set('game.dice.rolling', true)
				.set('game.dice.resources', Immutable.fromJS(resources))
				.commit();
	}

	/**
	 * Give some resources to the current player
	 * @param {Object} resources the resources received
	 */
	setMyCards(resources) {
		let myBinding = MyBinding.from(this._binding);
		myBinding.setCards(resources);

		this._binding.atomically()
				.set('me', myBinding.binding)
				.clear('game.dice.resources')
				.commit();
	}

	/**
	 * Launch the game
	 * @param {Object} resources the resources at the beginning of the game
	 */
	launchGame({ resources: resources }) {
		var myBinding = MyBinding.from(this._binding);
		myBinding.setCards(resources);

		var transaction = this._binding.atomically()
			.set('step', Globals.step.started);
		myBinding.save(transaction);
		transaction.commit();
	}

	/**
	 * Set the game in the preparation mode
	 */
	gamePrepare() {
		this._binding.set('step', Globals.step.prepare);
	}

	endTurn() {
		this._socket.emit(Channel.playTurnEnd);
	}

	/**
	 * New player started to play
	 * @param {*} playerId the player whose turn starts
	 */
	playTurnNew({ player: playerId }) {
		// get the board and player
		var players = PlayersBinding.from(this._binding);
		var currentPlayer = players.getPlayer(playerId);

		var transaction = this._binding.atomically();
		// Stores the id of the current player
		transaction.set('game.currentPlayerId', playerId);

		// Prepare the actions
		var boardBinding = BoardBinding.from(this._binding);
		if (PlayersBinding.isMe(currentPlayer)) {
			if (this._binding.get('step') === Step.prepare) { // choose a colony at start
				transaction.set('game.message', 'Choose a colony then a path');
				boardBinding.setSelectable('cities', true, BoardBinding.emptyElement);
			} else { // Roll the dice
				transaction.set('game.message', 'Roll the dice');
				transaction.set('game.dice.enabled', true);
			}
		} else { // passive turn
			transaction.set('game.message', `Playing : ${currentPlayer.get('name')}`);
			// TODO one may do better
			boardBinding.setSelectable('cities', false);
			boardBinding.setSelectable('paths', false);
		}

		// update the board
		boardBinding.save(transaction);

		transaction.commit();
	}

	/**
	 * Asks to move the thieves onto the given tile.
	 * @param {Object} tile the tile position of the thieves
	 */
	moveThieves(tile) {
		this._socket.emit(Channel.playMoveThieves, { tile: tile });
	}

	onThievesMove({ tile: tile }) {
		var boardBinding = BoardBinding.from(this._binding);
		boardBinding.moveThieves(tile);
		boardBinding.save(this._binding);
	}

}
