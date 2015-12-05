import DefaultDelegate from 'client/js/components/listener/delegates/default.js';
import { Channel } from 'client/js/components/libs/socket.js';
import { Board } from 'client/js/components/libs/globals.js';

const Step = {
	FROM_TYPE: 'From type',
	TO_TYPE: 'To type',
	WAITING: 'Waiting',
	COMPLETE: 'Complete'
};

export class ConvertResourcesDelegate extends DefaultDelegate {

  constructor(manager) {
    super(manager);

    this._typeToConvert = null;
	  this._convertedType = null;
  }

	initialize() {
    this._listener.on(Channel.playResourcesConvert, this.onConvertedResources.bind(this));

		this._step = Step.FROM_TYPE;
    this._manager.setMessage('Select card of type to convert.')
      .setAction(ConvertResourcesDelegate.ACTION);
      // Do something with card activation
      // .activate('cards', Conditions.emptyElement);
  }

  selectCard(type) {
	  if (this._step === Step.FROM_TYPE) {
		  this._typeToConvert = type;
		  this._step = Step.TO_TYPE;
		  this._manager.setMessage('Select tile of new type')
		    .activate('tiles', tile => tile.get('resource') !== Board.resourceName.desert);
	  } else {
		  throw new Error(`Invalid step to select cards. Current: ${this._step}`);
	  }
  }

	selectTile(tile) {
		if (this._step === Step.TO_TYPE) {
			// TODO return more than the key when selecting an element (tile, path, ...)
			this._convertedType = tile.get('resource');
			this._step = Step.WAITING;
			this._listener.emit(Channel.playResourcesConvert, { from: this._typeToConvert, to: this._convertedType });
		} else {
			throw new Error(`Invalid step to select cards. Current: ${this._step}`);
		}
	}

	onConvertedResources() {
		// Success! Nothing more to do
    this.complete(true);
	}

	complete(notifyManager = false) {
		this._step = Step.COMPLETE;
		this._manager.setAction(null)
			.deactivate('tiles'); // Consider to also deactivate cards if possible
    super.complete(notifyManager);
	}

}

ConvertResourcesDelegate.ACTION = 'ConvertResources';

export default ConvertResourcesDelegate;
