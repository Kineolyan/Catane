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

	constructor() {
		super(...arguments);
		this.unit = 10;
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props !== nextProps // default logic
			|| super.shouldComponentUpdate(nextProps, nextState); // Morearty logic
	}

	/**
	 * Render the whole map of the game
	 * @return {Object} the rendered element
	 */
	render() {
		this.unit = MapR.computeUnit(this.getDefaultBinding().get('cities'), this.props.width, this.props.height, this.props.margin);
		var tiles = this.mapElements('tiles', Tile);
		var paths = this.mapElements('paths', Path);
		var cities = this.mapElements('cities', City);

		return (
				<Group x={this.props.x + this.props.width / 2} y={this.props.y + this.props.height / 2}>
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
			return <Element key={key} binding={elementBinding} unit={this.unit}/>;
		});
	}

	/**
	 * Get the unit of the board in pixels
	 * @param {Binding} cities cities of the board
	 * @param {Number} width width of the map
	 * @param {Number} height height of the map
	 * @param {Number} margin top and bottom margin of the map
	 * @return {Number} the size of the grid
	 */
	static computeUnit(cities, width, height, margin) {
		var min = {	x: 0,	y: 0 };
		var max = { x: 0, y: 0 };
		cities.forEach(city => {
			for (let axis of ['x', 'y']) {
				let value = city.get(axis);
				if (value > 0 && value > max[axis]) {
					max[axis] = value;
				}

				if (value < 0 && value < min[axis]) {
					min[axis] = value;
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
	x: 0,
	y: 0,
	margin: 10
};