import Immutable from 'immutable';

import Globals from 'client/js/components/libs/globals';
import { Step } from 'client/js/components/libs/globals';
import Manager from 'client/js/components/listener/manager';
import Socket from 'client/js/components/libs/socket';
import { PlayersBinding, MyBinding } from 'client/js/components/common/players';
import { BoardBinding } from 'client/js/components/common/map';

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
					Socket.emit(Globals.socket.playTurnEnd);
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

}
