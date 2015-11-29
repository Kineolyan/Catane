import AActionButton from 'client/js/components/parts/GameInterface/actions/AActionButton.react';
import React from 'react'; // eslint-disable-line no-unused-vars

import { MyBinding } from 'client/js/components/common/players.js';
import { Board } from 'client/js/components/libs/globals.js';
import BuildRoadDelegate from 'client/js/components/listener/delegates/buildRoad.js';

export class BuildRoad extends AActionButton {
	constructor() {
		super(BuildRoadDelegate);
	}

	get label() {
		return 'Build road';
	}

	hasEnoughResources() {
		const myBinding = new MyBinding(this.myBinding);
		const resources = myBinding.resourceMap;
		return resources[Board.resourceName.bois] >= 1
			&& resources[Board.resourceName.tuile] >= 1;
	}
}

BuildRoad.theme = AActionButton.defaultTheme;
BuildRoad.defaultProps = AActionButton.defaultProps;
BuildRoad.displayName = 'BuildRoad';

export default BuildRoad;
