import DefaultDelegate from 'client/js/components/listener/delegates/default';
import { Channel } from 'client/js/components/libs/socket';
import { BoardBinding } from 'client/js/components/common/map';

const Step = {
	DROP_CARDS: 'Drop cards',
	WAIT_OTHERS: 'Wait others drops',
	PICK_TILE: 'Pick tile',
	WAIT_THIEVES: 'Wait thieves move',
	COMPLETE: 'Complete'
};

export class ThievesDelegate extends DefaultDelegate {
	/**
	 * Constructor
	 * @param	{GameManager} manager the manager handling the game
	 * @param {Number} resourcesToDrop number of resources to drop
	 *   or undefined to skip drop phase
	 * @param {boolean} moveThieves flag to move the thieves
	 * @private
	 */
	constructor(manager, resourcesToDrop, moveThieves) {
		super(manager);

		this._moveThieves = moveThieves;
		if (resourcesToDrop !== undefined) {
	    this._listener.on(Channel.gameAction, this.onGameAction.bind(this));
			this._listener.on(Channel.playResourcesDrop, this.onDroppedResources.bind(this));

			this._step = resourcesToDrop > 0 ? Step.DROP_CARDS : Step.WAIT_OTHERS;

			// Set up the board
			this._manager._binding.set('game.message', ThievesDelegate.getDropMessages(resourcesToDrop));
		} else {
			this.enableThievesMove();
		}

		this._listener.on(Channel.playMoveThieves, this.onThievesMove.bind(this));
	}

	static fromDrop(manager, resourcesToDrop, moveThieves) {
		return new ThievesDelegate(manager, resourcesToDrop, moveThieves);
	}

	static fromMove(manager, moveThieves) {
		return new ThievesDelegate(manager, undefined, moveThieves);
	}

	onGameAction({ action }) {
		if (action === 'move thieves') {
			this.enableThievesMove();
		}
	}

	/**
	 * Sets up the game to move thieves.
	 * This activates tiles and notifies the player if need.
	 * @private
	 */
	enableThievesMove() {
		this._step = this._moveThieves ? Step.PICK_TILE : Step.WAIT_THIEVES;
		var message;
		if (this._manager.isMyTurn()) {
			message = 'Move thieves';
		} else {
			var currentPlayer = this._manager.getCurrentPlayer();
			message = `${currentPlayer.get('name')} moving thieves`;
		}

		var transaction = this._manager._binding.atomically()
			.set('game.message', message);
		var boardBinding = BoardBinding.from(this._manager._binding);
		boardBinding.setSelectable('tiles', true, tile => tile.get('thieves') !== true);
		boardBinding.save(transaction);
		transaction.commit();
	}

	selectCard(type, index) {
		if (this._step === Step.DROP_CARDS) {
			var drop = {};
			drop[type] = 1;
			this._listener.emit(Channel.playResourcesDrop, drop);
			this._manager._binding.update('me.resources', resources => resources.delete(index));
		} else {
			throw new Error(`Cannot drop a card at that step ${this._step}`);
		}
	}

	onDroppedResources({ remaining }) {
			// Unset until it goes to the step 'move thieves'
		if (remaining === 0 && this._step === Step.DROP_CARDS) {
			this._step = Step.WAIT_OTHERS;
		}
		this._manager._binding.set('game.message', ThievesDelegate.getDropMessages(remaining));
	}

	selectTile(tile) {
		if (this._step === Step.PICK_TILE) {
      this._listener.emit(Channel.playMoveThieves, { tile: tile });
		} else {
			throw new Error(`Cannot move thieves at that step ${this._step}`);
		}
	}

	onThievesMove() {
		this._step = Step.COMPLETE;

    this.complete(true);
	}

	static getDropMessages(nbOfResources) {
		if (nbOfResources > 0) {
			return `Drop ${nbOfResources} resource${ nbOfResources > 1 ? 's' : ''}`;
		} else {
			return 'Waiting for other players to drop resources';
		}
	}
}

export default ThievesDelegate;
