'use strict';

/*
 A tile of the map
 */
import { Board } from 'client/js/components/libs/globals';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Group, Shape, Text, Path } from 'react-art';
import Circle from 'react-art/shapes/circle';

import MapElement from 'client/js/components/parts/GameInterface/Map/Element.react';

const VERTICES = [
	[0, -1],
	[1, -1],
	[1, 0],
	[0, 1],
	[-1, 1],
	[-1, 0]
];

export default class Tile extends MapElement {

	/**
	 * Gets the resource of the tile.
	 * @return {String} the resource of the tile
	 */
	get resource() {
		return this.getDefaultBinding().get('resource');
	}

	/**
	 * Find the color of a tile
	 * @return {String} the tile color
	 */
	get color() {
		return Board.resources[this.resource] || 'white';
	}

	doRender() {
		var tile = this.getDefaultBinding().get();
		var geometry; // TODO code geometry binding/provider
		var circleRadius = this.units(1 / 3);

		var path = new Path();
		VERTICES.forEach(([x, y], i) => {
			if (i !== 0) {
				path.lineTo(this.units(x), this.units(y));
			} else {
				path.moveTo(this.units(x), this.units(y));
			}
		});
		path.close();

		var diceValue;
		if (tile.get('diceValue')) {
			diceValue =	(<Group>
					<Circle radius={circleRadius} fill="white" stroke="black"/>
					<Text ref="value" y={-circleRadius / 2} fill="black" alignment="center"
					      font={{ 'font-size': circleRadius + 'px' }}>
						{ tile.get('diceValue') }
					</Text>
				</Group>);
		}

		return [
			<Shape d={path} fill={this.color} stroke='#FFFFFF' />,
			diceValue
		];
	}
}

Tile.displayName = 'Tile';
