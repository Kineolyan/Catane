import DefaultDelegate from 'client/js/components/listener/delegates/default';
import { Channel } from 'client/js/components/libs/socket';

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
			this._manager.setMessage(ThievesDelegate.getDropMessages(resourcesToDrop));
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
		if (this._manager.isMyTurn()) {
			this._manager.setMessage('Move thieves');
		} else {
			var currentPlayer = this._manager.getCurrentPlayer();
			this._manager.setMessage(`${currentPlayer.get('name')} moving thieves`);
		}

		this._manager.activate('tiles', tile => tile.get('thieves') !== true);
	}

	selectCard(type, index) {
		if (this._step === Step.DROP_CARDS) {
			var drop = {};
			drop[type] = 1;
			this._listener.emit(Channel.playResourcesDrop, drop);
			// TODO do more here to manipulate resources
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
		this._manager.setMessage(ThievesDelegate.getDropMessages(remaining));
	}

	selectTile(tile) {
		if (this._step === Step.PICK_TILE) {
			const tileKey = tile.get('key').toJS();
      this._listener.emit(Channel.playMoveThieves, { tile: tileKey });
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
