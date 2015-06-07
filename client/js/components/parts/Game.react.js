'use strict';

/*
 React component containing the whole game interface
 */


import Globals from 'client/js/components/libs/globals';

import React from 'react';

import StartInterface from 'client/js/components/parts/StartInterface/StartInterface.react';
import GameInterface from 'client/js/components/parts/GameInterface/GameInterface.react';
import Reconnect from 'client/js/components/parts/Reconnect.react.js';
import DevTool from 'client/js/components/parts/DevTool.react.js';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

const DEBUG = false;

export default class Game extends MoreartyComponent {
	/**
	 * Render the whole interface of the game
	 * @return {XML} the rendered element
	 */
	render() {
		var binding = this.getDefaultBinding();
		var initialStep = binding.get('step') === Globals.step.init;

		return (
				<div>
					{ DEBUG ? <DevTool binding={binding}/> : null }
					{ initialStep ? <Reconnect init={binding.get('server').toJS()}/> : null }
					{this.renderStart()}
				</div>
		);
	}

	/**
	 * Render the game to be played
	 * @return {XML} the rendered element
	 */
	renderStart() {
		var binding = this.getDefaultBinding();
		if (binding.get('step') === Globals.step.init) {
			return (<StartInterface binding={binding}/>);
		} else {
			return (<GameInterface binding={binding}/>);
		}
	}
}

Game.displayName = 'Game';
