'use strict';

/*
 React component containing the map interface
 */

import { Group } from 'react-art';

import React from 'react'; // eslint-disable-line no-unused-vars
import Tile from 'client/js/components/parts/GameInterface/Map/Tile.react';
import City from 'client/js/components/parts/GameInterface/Map/City.react';
import Path from 'client/js/components/parts/GameInterface/Map/Path.react';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

export default class MapR extends MoreartyComponent {

	/**
	 * Render the whole map of the game
	 * @return {Object} the rendered element
	 */
	render() {
		var board = this.getDefaultBinding().get().toJS().getBoard(),
				elements = [];

		for (let type of ['tiles', 'paths', 'cities']) { // keep the order of display, tiles under paths under cities
			var Elem;
			switch (type) {
				case 'tiles':
					Elem = Tile;
					break;

				case 'paths':
					Elem = Path;
					break;

				case 'cities':
					Elem = City;
					break;
			}

			if (!Elem) {
				continue;
			}

			board.elements.get(type).forEach((elem) => elements.push(<Elem key={elem.index} value={elem}/>));
		}

		return (
				<Group x={this.props.width / 2} y={this.props.height / 2}>
					{elements}
				</Group>
		);
	}


}

MapR.displayName = 'Map';