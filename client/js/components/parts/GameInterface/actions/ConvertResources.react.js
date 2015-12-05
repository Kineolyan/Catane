import AActionButton from 'client/js/components/parts/GameInterface/actions/AActionButton.react';
import React from 'react'; // eslint-disable-line no-unused-vars

import { MyBinding } from 'client/js/components/common/players.js';
import ConvertResourcesDelegate from 'client/js/components/listener/delegates/convertResources.js';
import * as map from 'libs/collections/maps';

export class ConvertResources extends AActionButton {
	constructor() {
		super(ConvertResourcesDelegate);
	}

	get label() {
		return 'Convert resources';
	}

	hasEnoughResources() {
		const myBinding = new MyBinding(this.myBinding);
		const resources = myBinding.resourceMap;
		for (let [, count] of map.entries(resources)) {
			if (count >= 4) { return true; }
		}
		return false;
	}
}

ConvertResources.theme = AActionButton.defaultTheme;
ConvertResources.defaultProps = AActionButton.defaultProps;
ConvertResources.displayName = 'ConvertResources';

export default ConvertResources;
