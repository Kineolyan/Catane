'use strict';

/*
 Edge of one tile
 */
import Socket from 'client/js/components/libs/socket';
import Globals from 'client/js/components/libs/globals';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Path, Shape } from 'react-art';

import MapElement from 'client/js/components/parts/GameInterface/Map/Element.react';

export default class PathR extends MapElement {

	get x() {
		return this.getDefaultBinding().get('from.x');
	}

	get y() {
		return this.getDefaultBinding().get('from.y');
	}

	doRender() {
		var path = this.getDefaultBinding().get();
		var path = this.props.value;
		var p = new Path();
		var thickness = this.props.thickness;
		var color = path.get('player.color') || 'black';

		/* The idea is to draw a rectangle in any direction using path */
		// get the direction of the path
		var coef;
		if (path.to.y !== path.from.y) {
			coef = -1 * (path.to.x - path.from.x) / (path.to.y - path.from.y);
		} else {
			coef = 1;
			thickness *= 1.5;
		}

		var diff = Math.sqrt(Math.pow(thickness, 2) / (1 + Math.pow(coef, 2)));

		// draw
		p.moveTo(units(path.get('from.x') - diff), units(path.get('from.y') - diff) * coef);
		p.lineTo(units(path.get('from.x') + diff), units(path.get('from.y') + diff) * coef);
		p.lineTo(units(path.get('to.x') + diff), units(path.get('to.y') + diff) * coef);
		p.lineTo(units(path.get('to.x') - diff), units(path.get('to.y') - diff) * coef);
		p.close();

		return (<Shape d={p} fill={color}	/>);
	}

	get actions() {
		var actions = super.actions;
		actions.onClick = this.handleClick.bind(this);

		return actions;
	}

	handleClick() {
		if (this.props.value.selectable) {
			Socket.emit(Globals.socket.playPickPath, { path: this.props.value.key });
		}
	}
}

PathR.defaultProps = {
	thickness: 3
};

PathR.displayName = 'Path';