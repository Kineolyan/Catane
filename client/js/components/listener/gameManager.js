import Immutable from 'immutable';

import Globals from 'client/js/components/libs/globals';
import { Step, Interface } from 'client/js/components/libs/globals';
import Manager from 'client/js/components/listener/manager';
import { Channel } from 'client/js/components/libs/socket';
import { PlayersBinding, MyBinding } from 'client/js/components/common/players';
import { BoardBinding } from 'client/js/components/common/map';
import LocalStorage from 'client/js/components/libs/localStorage';
import PlacementDelegate from 'client/js/components/listener/delegates/placement';
import ThievesDelegate from 'client/js/components/listener/delegates/thieves';

const localStorage = new LocalStorage();

export const Conditions = {
	emptyElement: BoardBinding.emptyElement
};

export default class GameManager extends Manager {
	constructor() {
		super(...arguments);
		this._delegate = null;
	}

	startListen() {
		this.listenToSocket(Channel.reconnect, this.onReconnection.bind(this));

		this.listenToSocket(Channel.gameStart, this.onGameStart.bind(this));
		this.listenToSocket(Channel.gamePrepare, this.gamePrepare.bind(this));
		this.listenToSocket(Channel.gamePlay, this.launchGame.bind(this));
		this.listenToSocket(Channel.gameReload, this.onGameReload.bind(this));
		this.listenToSocket(Channel.gameAction, this.onGameAction.bind(this));

		this.listenToSocket(Channel.playTurnNew, this.playTurnNew.bind(this));
		this.listenToSocket(Channel.playRollDice, this.onRolledDice.bind(this));
		this.listenToSocket(Channel.playPickColony, this.playPickElement.bind(this));
		this.listenToSocket(Channel.playPickPath, this.playPickElement.bind(this));

		this.listenToSocket(Channel.playAddColony, this.assignElement.bind(this, 'colony'));

		this.listenToSocket(Channel.playMoveThieves, this.onThievesMove.bind(this));
		this.listenToSocket(Channel.playResourcesDrop, this.onDroppedResources.bind(this));
	}

	/**
	 * Gets the current player.
	 * @return {Object} the player
	 */
	getCurrentPlayer() {
		var playersBinding = PlayersBinding.from(this._binding);
		return playersBinding.getPlayer(this._binding.get('game.currentPlayerId'));
	}

	/**
	 * Gets if it is the turn of the player.
	 * @return {Boolean} true if it is the player turn.
	 */
	isMyTurn() {
		var playersBinding = PlayersBinding.from(this._binding);
		var currentPlayer = playersBinding.getPlayer(this._binding.get('game.currentPlayerId'));
		return PlayersBinding.isMe(currentPlayer);
	}

	/**
	 * Sets a new message for player.
	 * @param {String} message the message to display
	 * @return {GameManager} this
	 */
	setMessage(message) {
		this._binding.set('game.message', message);
		return this;
	}

	/**
	 * Activates an element of a given type
	 * @param {String} element name of the element
	 * @param {Function?} condition condition for activation
	 * @return {GameManager} this
	 */
	activate(element, condition) {
		var boardBinding = BoardBinding.from(this._binding);
		boardBinding.setSelectable(element, true, condition);
		boardBinding.save(this._binding);

		return this;
	}

	/**
	 * Deactivates an element of a given type.
	 * @param {String} element name of the element
	 * @param {Function?} condition condition for deactivation
	 * @return {GameManager} this
	 */
	deactivate(element, condition) {
		var boardBinding = BoardBinding.from(this._binding);
		boardBinding.setSelectable(element, false, condition);
		boardBinding.save(this._binding);

		return this;
	}

	/**
	 * Sets the new delegate for the game.
	 * If a delegate was previously defined, #complete is called on it.
	 * @param {*} delegate delegate to configure, or null to remove the existing one.
	 */
	setDelegate(delegate) {
		if (this._delegate !== null) {
			this._delegate.complete();
		}
		this._delegate = delegate;
	}

	notifyDelegateCompletion() {
		this._delegate = null;
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

		var myBinding = MyBinding.from(this._binding);
		this._delegate = new PlacementDelegate(this, myBinding.id);
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

	onGameAction(payload) {
		switch (payload.action) {
		case 'drop resources':
			this.displayDropStatus(payload);
			break;
			// FIXME may move thieves directly, skipping drop-resources phase
		case 'move thieves':
			this.askMoveThieves();
			break;
		}
	}

	// TODO maybe rename that method
	displayDropStatus({ remaining }) {
		// Start the delegate if not done yet
		if (this._delegate === null) {
			var myBinding = MyBinding.from(this._binding);
			var resToDrop = remaining[myBinding.id];
			this._delegate = ThievesDelegate.fromDrop(this, resToDrop || 0, this.isMyTurn());
		}
	}

	askMoveThieves() {
		if (this._delegate === null) {
			this._delegate = ThievesDelegate.fromMove(this, this.isMyTurn());
		}
	}

	selectTile(tile) {
		this._delegate.selectTile(tile);
	}

	selectCity(city) {
		this._delegate.selectCity(city);
	}

	selectPath(path) {
		this._delegate.selectPath(path);
	}

	selectCard(type, index) {
		this._delegate.selectCard(type, index);
	}

	/**
	 * A player picked something on the map
	 * @param {Object} res result of the picking
	 */
	playPickElement(res) {
		if (this._binding.get('step') === Step.prepare) {
			// get the map
			var players = PlayersBinding.from(this._binding);
			var boardBinding = BoardBinding.from(this._binding);
			var player = players.getPlayer(res.player);

			var type;
			var payload;
			// choose what to do
			if (res.colony) {
				type = 'cities';
				payload = res.colony;
			} else if (res.path) {
				type = 'paths';
				payload = res.path;
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
	 * Assigns a element to a player
	 * @param {String} type the name of the element to assign
	 * @param {Object} payload the action payload, provided by the server
	 */
	assignElement(type, payload) {
			var players = PlayersBinding.from(this._binding);
			var boardBinding = BoardBinding.from(this._binding);
			var player = players.getPlayer(payload.player);

			var key;
			switch (type) {
				case 'colony':
					key = 'cities';
					break;
				case 'path':
					key = 'paths';
					break;
				default:
					throw new Error(`Unsupported type ${type}. Payload: ${payload}`);
			}

			var element = payload[type];
			if(element !== undefined) {
				// give an element to a player
				boardBinding.giveElement(key, element, player);
				boardBinding.save(this._binding);
			} else {
				throw new Error(`Cannot find ${type} in ${payload}`);
			}

			if (payload.resources !== undefined) {
				// The player used some resources. Update it
				const myBinding = MyBinding.from(this._binding);
				myBinding.setCards(payload.resources);
				myBinding.save(this._binding);
			}
	}

	rollDice() {
		this._socket.emit(Channel.playRollDice);
	}

	/**
	 * Roll the dice
	 * @param {Array} dice dice values picked
	 */
	onRolledDice({ dice: dice, resources: resources }) {
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
	launchGame({ resources }) {
		this._delegate.complete();
		this._delegate = null;

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

	/**
	 * Asks to end the turn of the player.
	 */
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
			if (this._binding.get('step') !== Step.prepare) {
				transaction.set('game.message', 'Roll the dice');
				transaction.set('game.dice.enabled', true);
			}
		} else { // passive turn
			transaction.set('game.message', `Playing : ${currentPlayer.get('name')}`);
			// TODO may already be done
			boardBinding.setSelectable('cities', false);
			boardBinding.setSelectable('paths', false);
		}

		// update the board
		boardBinding.save(transaction);

		transaction.commit();
	}

	onThievesMove({ tile: tile }) {
		var boardBinding = BoardBinding.from(this._binding);
		boardBinding.moveThieves(tile);
		boardBinding.save(this._binding);
	}

	onDroppedResources() {
		// Currently nothing to do since it is handled by #onGameAction
	}

}
