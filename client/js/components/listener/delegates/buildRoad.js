import _ from 'lodash';

import DefaultDelegate from 'client/js/components/listener/delegates/default.js';
import { Channel } from 'client/js/components/libs/socket.js';
import { Conditions } from 'client/js/components/listener/gameManager.js';

export class BuildRoadDelegate extends DefaultDelegate {

  constructor(manager) {
	  super(manager);

	  this._selectedPath = null;
  }

	initialize() {
    this._listener.on(Channel.playAddRoad, this.onAddedRoad.bind(this));

    this._manager.setMessage('Select a path to build.')
      .setAction(BuildRoadDelegate.ACTION)
      .activate('paths', Conditions.emptyElement);
  }

  selectPath(path) {
    const pathKey = path.get('key').toJS();
    this._selectedPath = pathKey;
    this._listener.emit(Channel.playAddRoad, { path: pathKey });
  }

  onAddedRoad({ path }) {
    if (_.eq(path, this._selectedPath)) {
      this.complete(true);
    }
  }

	complete(notifyManager = false) {
    this._manager.deactivate('paths')
      .setAction(null);
    super.complete(notifyManager);
	}

}

BuildRoadDelegate.ACTION = 'BuildRoad';

export default BuildRoadDelegate;
