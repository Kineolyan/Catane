'use strict';

/*
	One city of the game
*/
import { gameManager } from 'client/js/components/listener/listener';

import React from 'react'; // eslint-disable-line no-unused-vars
import Circle from 'react-art/shapes/circle';

import MapElement from 'client/js/components/parts/GameInterface/Map/Element.react';

export default class City extends MapElement {

	doRender() {
		var city = this.getDefaultBinding();
		var player = this.getBinding('player');
		var color =  player !== undefined && player.get('color') || 'black';

		return (
			<Circle radius={this.props.radius} fill={color}/>
		);
	}

	get actions() {
		var actions = super.actions;
		if(this.isSelectable()) {
			actions.onClick = this.handleClick.bind(this);
		}

		return actions;
	}

	handleClick() {
		var city = this.getDefaultBinding();
		gameManager().selectCity(city.get('key').toJS());
	}
}

City.defaultProps = {
	radius: 10
};

City.displayName = 'City';