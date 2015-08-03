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
		var tiles = mapTiles((tile, key) => <Tile index={key} binding={tile}/>);
		var paths = mapPaths((path, key) => <Path index={key} binding={path} />);
		var cities = mapCities((city, key) => <City index={key} binding={city} />);

		return (
				<Group x={this.props.width / 2} y={this.props.height / 2}>
					{tiles}
					{paths}
					{cities}
				</Group>
		);
	}

	mapTiles(cbk) {
		var tiles = this.getDefaultBinding().get('tiles');
		tiles.forEach((tile, i) => {
			var tileBinding = tiles.sub(i);
			var hashCode = tile.get('x') * 100 + tile.get('y');
			cbk(tileBinding, hashCode);
		});
	}

	mapPaths(cbk) {
		var paths = this.getDefaultBinding().get('paths');
		paths.forEach((path, i) => {
			var pathBinding = paths.sub(i);
			// TODO compute the hash of the path
			var hashCode = null;//path.get('x') * 100 + path.get('y');
			cbk(pathBinding, hashCode);
		});
	}

	mapCities(cbk) {
		var cities = this.getDefaultBinding().get('cities');
		cities.forEach((city, i) => {
			var cityBinding = cities.sub(i);
			var hashCode = city.get('x') * 100 + city.get('y');
			cbk(cityBinding, hashCode);
		});
	}
}

MapR.displayName = 'Map';