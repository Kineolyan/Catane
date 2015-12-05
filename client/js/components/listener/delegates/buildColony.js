import _ from 'lodash';

import DefaultDelegate from 'client/js/components/listener/delegates/default.js';
import { Channel } from 'client/js/components/libs/socket.js';
import { Conditions } from 'client/js/components/listener/gameManager.js';

export class BuildColonyDelegate extends DefaultDelegate {

  constructor(manager) {
    super(manager);

    this._selectedColony = null;
  }

	initialize() {
    this._listener.on(Channel.playAddColony, this.onAddedColony.bind(this));

    this._manager.setMessage('Select a colony to settle on.')
      .setAction(BuildColonyDelegate.ACTION)
      .activate('cities', Conditions.emptyElement);
  }

  selectCity(colony) {
    const colonyKey = colony.get('key').toJS();
    this._selectedColony = colonyKey;
    this._listener.emit(Channel.playAddColony, { colony: colonyKey });
  }

  onAddedColony({ colony }) {
    if (_.eq(colony, this._selectedColony)) {
      this.complete(true);
    }
  }

	complete(notifyManager = false) {
    this._manager.deactivate('cities')
      .setAction(null);
    super.complete(notifyManager);
	}

}

BuildColonyDelegate.ACTION = 'BuildColony';

export default BuildColonyDelegate;
