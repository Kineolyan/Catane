import * as _ from 'lodash';

import DefaultDelegate from 'client/js/components/listener/delegates/default.js';
import { Channel } from 'client/js/components/libs/socket.js';
import { Conditions } from 'client/js/components/listener/gameManager.js';

export class BuildRoadDelegate extends DefaultDelegate {

  constructor(manager) {
    super(manager);

    this._selectedPath = null;
    this._listener.on(Channel.playAddRoad, this.onAddedRoad.bind(this));

    this._manager.setMessage('Select a path to build.')
      .activate('paths', Conditions.emptyElement);
  }

  selectPath(path) {
    this._selectedPath = path;
    this._listener.emit(Channel.playAddRoad, { path });
  }

  onAddedRoad({ path }) {
    if (_.eq(path, this._selectedPath)) {
      this.complete(true);
    }
  }

	complete(notifyManager = false) {
    this._manager.deactivate('paths');
    super.complete(notifyManager);
	}

}

export default BuildRoadDelegate;
