'use strict';

/*
 A tile of the map
 */
import { Board } from 'client/js/components/libs/globals';
import { VERTICES } from 'client/js/components/common/map';
import { gameManager } from 'client/js/components/listener/listener';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Group, Shape, Text, Path } from 'react-art';
import Circle from 'react-art/shapes/circle';

import MapElement from 'client/js/components/parts/GameInterface/Map/Element.react';

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

	get hasThieves() {
		return this.getDefaultBinding().get('thieves') === true;
	}

	isSelectable() {
		return super.isSelectable()
			&& !this.hasThieves;
	}

	get actions() {
		var actions = super.actions;
		if (this.isSelectable()) {
			actions.onClick = this.handleClick.bind(this);
		}

		return actions;
	}

	doRender() {
		var tile = this.getDefaultBinding();
		var circleRadius = this.units(1 / 3);

		var path = new Path();
		VERTICES.forEach(({ x: x, y: y }, i) => {
			if (i !== 0) {
				path.lineTo(this.units(x), this.units(y));
			} else {
				path.moveTo(this.units(x), this.units(y));
			}
		});
		path.close();

		var diceElement = null;
		var hasThieves = this.hasThieves;
		var diceValue = tile.get('diceValue');
		if (diceValue || hasThieves) {
			diceElement =	(<Group key="diceValue">
					<Circle radius={circleRadius} fill={ hasThieves ? '#4a4a4a' : 'white'} stroke="black"/>
					{ diceValue ?
						<Text ref="value" y={-circleRadius / 2} fill={ hasThieves ? '#e0e0e0' : 'black'} alignment="center"
					      font={{ 'font-size': circleRadius + 'px' }}>
						{ diceValue.toString() }
						</Text> :
						null }
				</Group>);
		}

		return [
			<Shape key="shape" d={path} fill={this.color} stroke='#FFFFFF' />,
			diceElement
		];
	}

	handleClick() {
		var key = this.getDefaultBinding().get('key');
		gameManager().selectCity(key.toJS());
	}
}

Tile.displayName = 'Tile';
