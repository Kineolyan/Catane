'use strict';


/*
	One city of the game
*/
import Socket from 'client/js/components/libs/socket';
import Globals from 'client/js/components/libs/globals';

import React from 'react'; // eslint-disable-line no-unused-vars
import Circle from 'react-art/shapes/circle';

import MapElement from 'client/js/components/parts/GameInterface/Map/Element.react';

export default class City extends MapElement {

	doRender() {
		var city = this.getDefaultBinding();
		var color = city.get('player.color') || 'black';

		return (
			<Circle radius={this.props.radius} fill={color}/>
		);
	}

	get actions() {
		var actions = super.actions;
		actions.onClick = this.handleClick.bind(this);

		return actions;
	}

	handleClick() {
		if(this.isSelectable()) {
			var city = this.getDefaultBinding();
			Socket.emit(Globals.socket.playPickColony, { colony: city.get('key').toJS() });
		}
	}
}

City.defaultProps = {
	radius: 10
};

City.displayName = 'City';