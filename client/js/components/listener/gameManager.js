import Immutable from 'immutable';

import Globals from 'client/js/components/libs/globals';
import Manager from 'client/js/components/listener/manager';
import Socket from 'client/js/components/libs/socket';
import { PlayersBinding, MyBinding } from 'client/js/components/common/players';

export default class GameManager extends Manager {

	startListen() {
		this.listenToSocket(Globals.socket.gamePrepare, this.gamePrepare.bind(this));
		this.listenToSocket(Globals.socket.gamePlay, this.launchGame.bind(this));
		this.listenToSocket(Globals.socket.playTurnNew, this.playTurnNew.bind(this));
		this.listenToSocket(Globals.socket.mapDice, this.rollDice.bind(this));
		this.listenToSocket(Globals.socket.playPickColony, this.playPickElement.bind(this));
		this.listenToSocket(Globals.socket.playPickPath, this.playPickElement.bind(this));
	}

	/**
	 * A player picked something on the map
	 * @param {Object} res result of the picking
	 */
	playPickElement(res) {
		if (this._binding.get('step') === Globals.step.prepare) {
			// get the map
			var players = new PlayersBinding(this._binding.get('players'));
			var boardContainer = this._binding.get('game.board').toJS();
			var board = boardContainer.getBoard();

			var player = players.getPlayer(res.player);
			var key;
			var payload;
			// choose what to do
			if (res.colony) {
				key = 'cities';
				payload = res.colony;
				board.setSelectableType('paths');
			} else if (res.path) {
				key = 'paths';
				payload = res.path;
				board.setSelectableType(null);
				Socket.emit(Globals.socket.playTurnEnd);
			}

			// give an element to a player
			board.giveElement(key, payload, player.toJS());
			this._binding.set('game.board', Immutable.fromJS(boardContainer));
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
	* Give some resouces to the current player
	 * @param {Object} resources the resources received
	*/
	giveCards(resources) {
		let myBinding = MyBinding.from(this._binding);
		myBinding.giveCards(resources);

		this._binding.atomically()
				.set('me', myBinding.binding)
				.clear('game.dice.resources')
				.commit();
	}

	/**
	 * Launch the game
	 */
	launchGame() {
		this._binding.set('step', Globals.step.started);
	}

	/**
	 * Set the game in the preparation mode
	 */
	gamePrepare() {
		this._binding.set('step', Globals.step.prepare);
	}

	/**
	 * New player started to play
	 * @param {*} playerId the player whose turn starts
	 */
	playTurnNew({ player: playerId }) {
		// get the board and player
		var players = new PlayersBinding(this._binding.get('players'));
		var boardContainer = this._binding.get('game.board').toJS();
		var board = boardContainer.getBoard();
		var currentPlayer = players.getPlayer(playerId);
		var transaction = this._binding.atomically();

		if (PlayersBinding.isMe(currentPlayer)) {
			if (this._binding.get('step') === Globals.step.prepare) { // choose a colony at start
				transaction.set('game.message', 'Choose a colony then a path');
				board.setSelectableType('cities');
			} else { // Roll the dice
				transaction.set('game.message', 'Roll the dice');
				transaction.set('game.dice.enabled', true);
			}
		} else { // passive turn
			transaction.set('game.message', `Playing : ${currentPlayer.get('name')}`);
			board.setSelectableType(null);
		}

		// update the board
		transaction.set('game.board', Immutable.fromJS(boardContainer));
		transaction.commit();
	}

}
