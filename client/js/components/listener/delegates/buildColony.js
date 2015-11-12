import * as _ from 'lodash';

import DefaultDelegate from 'client/js/components/listener/delegates/default.js';
import { Channel } from 'client/js/components/libs/socket.js';
import { Conditions } from 'client/js/components/listener/gameManager.js';

export class BuildColonyDelegate extends DefaultDelegate {

  constructor(manager) {
    super(manager);

    this._selectedColony = null;
    this._listener.on(Channel.playAddColony, this.onAddedColony.bind(this));

    this._manager.setMessage('Select a colony to settle on.')
      .activate('cities', Conditions.emptyElement);
  }

  selectCity(colony) {
    this._selectedColony = colony;
    this._listener.emit(Channel.playAddColony, { colony: colony });
  }

  onAddedColony({ colony }) {
    if (_.eq(colony, this._selectedColony)) {
      this.complete(true);
    }
  }

	complete(notifyManager = false) {
    this._manager.deactivate('cities');
    super.complete(notifyManager);
	}

}

export default BuildColonyDelegate;
