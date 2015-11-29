import AActionButton from 'client/js/components/parts/GameInterface/actions/AActionButton.react';
import React from 'react'; // eslint-disable-line no-unused-vars

import { MyBinding } from 'client/js/components/common/players.js';
import { Board } from 'client/js/components/libs/globals.js';
import BuildColonyDelegate from 'client/js/components/listener/delegates/buildColony.js';

export class BuildColony extends AActionButton {
	constructor() {
		super(BuildColonyDelegate);
	}

	get label() {
		return 'Build colony';
	}

  hasEnoughResources() {
    const myBinding = new MyBinding(this.myBinding);
    const resources = myBinding.resourceMap;
    return resources[Board.resourceName.bois] >= 1
      && resources[Board.resourceName.tuile] >= 1
      && resources[Board.resourceName.mouton] >= 1
      && resources[Board.resourceName.ble] >= 1;
  }
}

BuildColony.theme = AActionButton.defaultTheme;
BuildColony.defaultProps = AActionButton.defaultProps;
BuildColony.displayName = 'BuildColony';

export default BuildColony;
