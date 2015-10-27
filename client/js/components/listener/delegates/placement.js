import DefaultDelegate from 'client/js/components/listener/delegates/default';
import { Channel } from 'client/js/components/libs/socket';
import * as _ from 'lodash';
import { Conditions } from 'client/js/components/listener/gameManager.js';

const Step = {
	INIT: 'Init',
	HAS_SPOT: 'Has spot',
	COMPLETE: 'Complete'
};

export class PlacementDelegate extends DefaultDelegate {
	/**
	 * Constructor
	 * @param	{GameManager} manager the manager handling the game
	 * @param {Number} pId my player id
	 */
	constructor(manager, pId) {
		super(manager);

		this._step = null;
		this._player = pId;
		// TODO Make cities selectable

		this._listener.on(Channel.playTurnNew, this.onTurnStart.bind(this));
		this._listener.on(Channel.playPickColony, this.onPickedColony.bind(this));
		this._listener.on(Channel.playPickPath, this.onPickedPath.bind(this));
	}

	onTurnStart({ player }) {
		if (player === this._player) {
			this._step = Step.INIT;
			this._manager.setMessage('Choose a new colony')
				.activate('cities', Conditions.emptyElement);
		}
	}

	selectCity(city) {
		if (this._step === Step.INIT) {
			this._selection = city;
			this._listener.emit(Channel.playPickColony, { colony: city });
		} else {
			throw new Error(`Cannot select city at that step ${this._step}`);
		}
	}

	onPickedColony({ player, colony }) {
		if (player === this._player && _.eq(colony, this._selection)) {
			this._selection = null;
			this._step = Step.HAS_SPOT;
			this._manager.setMessage('Choose a path')
				.deactivate('cities')
				.activate('paths', Conditions.emptyElement);
		}
	}

	selectPath(path) {
		if (this._step === Step.HAS_SPOT) {
      this._selection = path;
			this._listener.emit(Channel.playPickPath, { path: path });
		} else {
			throw new Error(`Cannot select path at that step ${this._step}`);
		}
	}

	onPickedPath({ player, path }) {
		if (player === this._player && _.eq(path, this._selection)) {
			this._selection = null;
			this._step = Step.COMPLETE;
			this._manager.deactivate('paths');
		}
	}
}

export default PlacementDelegate;
