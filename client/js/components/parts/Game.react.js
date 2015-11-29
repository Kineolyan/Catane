'use strict';

import Globals from 'client/js/components/libs/globals';

import StartInterface from 'client/js/components/parts/StartInterface/StartInterface.react';
import GameInterface from 'client/js/components/parts/GameInterface/GameInterface.react';
import Reconnect from 'client/js/components/parts/Reconnect.react.js';
import DevTool from 'client/js/components/parts/DevTool.react.js';

import React from 'react'; // eslint-disable-line no-unused-vars
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

const DEBUG = false;

/**
 * React component containing the whole game interface
 */
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
					{ initialStep ? <Reconnect server={binding.get('server').toJS()}/> : null }
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
