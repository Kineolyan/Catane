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
		var tiles = this.mapElements('tiles', Tile);
		var paths = this.mapElements('paths', Path);
		var cities = this.mapElements('cities', City);

		return (
				<Group x={this.props.width / 2} y={this.props.height / 2}>
					{tiles.toArray()}
					{paths.toArray()}
					{cities.toArray()}
				</Group>
		);
	}

	mapElements(type, Element) {
		var elements = this.getDefaultBinding().get(type);
		var binding = this.getDefaultBinding().sub(type);
		return elements.map((element, i) => {
			var elementBinding = binding.sub(i);
			var key = element.get('key');
			return <Element key={key} binding={elementBinding} unit={this.props.unit}/>;
		});
	}

	/**
	 * Get the unit size of one edge of a tiles
	 * @param {Array} binding of the tiles of the game
	 * @param {Number} width width of the map
	 * @param {Number} height height of the map
	 * @param {Number} margin top and bottom margin of the map
	 * @return {Number} the size of one edge
	 */
	static computeUnit(tiles, width, height, margin) {
		var min = {	x: 0,	y: 0 };
		var max = { x: 0, y: 0 };
		tiles.forEach(tile => {
			for (let axis of ['x', 'y']) {
				let value = tile.get(axis);
				if (value > 0 && value > max[j]) {
					max[j] = value;
				}

				if (value < 0 && value < min[j]) {
					min[j] = value;
				}
			}
		});

		var xUnit = parseInt((width - margin) / (max.x - min.x), 10);
		var yUnit = parseInt((height - margin) / (max.y - min.y), 10);
		return Math.min(xUnit, yUnit);
	}
}

MapR.displayName = 'Map';

MapR.defaultProps = {
	unit: 60
};