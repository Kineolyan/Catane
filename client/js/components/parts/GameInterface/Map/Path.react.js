'use strict';

/*
 Edge of one tile
 */
import { gameManager } from 'client/js/components/listener/listener';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Path, Shape } from 'react-art';

import MapElement from 'client/js/components/parts/GameInterface/Map/Element.react';

export default class PathR extends MapElement {

	// TODO maybe do better to place the element at a place and draw
	// only the required path
	get x() {
		return 0;
	}

	get y() {
		return 0;
	}

	doRender() {
		var path = this.getDefaultBinding();
		var player = this.getBinding('player');
		var p = new Path();
		var thickness = this.props.thickness;
		var color = player !== undefined && player.get('color') || 'black';

		/* The idea is to draw a rectangle in any direction using path */
		// get the direction of the path
		var coef;
		if (path.get('to.y') !== path.get('from.y')) {
			coef = -1 * (path.get('to.x') - path.get('from.x')) / (path.get('to.y') - path.get('from.y'));
		} else {
			coef = 1;
			thickness *= 1.5;
		}

		var diff = Math.sqrt(Math.pow(thickness, 2) / (1 + Math.pow(coef, 2)));

		// draw
		p.moveTo(this.units(path.get('from.x')) - diff, this.units(path.get('from.y')) - diff * coef);
		p.lineTo(this.units(path.get('from.x')) + diff, this.units(path.get('from.y')) + diff * coef);
		p.lineTo(this.units(path.get('to.x')) + diff, this.units(path.get('to.y')) + diff * coef);
		p.lineTo(this.units(path.get('to.x')) - diff, this.units(path.get('to.y')) - diff * coef);
		p.close();

		return (<Shape d={p} fill={color}	/>);
	}

	get actions() {
		var actions = super.actions;

		if (this.isSelectable()) {
			actions.onClick = this.handleClick.bind(this);
		}

		return actions;
	}

	handleClick() {
		var path = this.getDefaultBinding();
		gameManager().selectPath(path.get('key').toJS());
	}
}

PathR.defaultProps = {
	thickness: 3
};

PathR.displayName = 'Path';