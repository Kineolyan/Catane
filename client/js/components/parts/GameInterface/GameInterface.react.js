'use strict';

/*
 React component containing the game interface
 */

import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';
import React from 'react'; // eslint-disable-line no-unused-vars

import { Surface } from 'react-art';

import MapReact from 'client/js/components/parts/GameInterface/Map/Map.react';
import DiceReact from 'client/js/components/parts/GameInterface/Dice.react';
import PlayersInfo from 'client/js/components/parts/GameInterface/PlayersInfo/PlayersInfo.react';
import Message from 'client/js/components/parts/GameInterface/Message.react';
import EndTurn from 'client/js/components/parts/GameInterface/EndTurn.react';

import Globals from 'client/js/components/libs/globals';

export default class GameInterface extends MoreartyComponent {

	constructor() {
		super(...arguments);

		this.state = {
			width: window.innerWidth,
			height: window.innerHeight
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state !== nextState // Default logic
			|| super.shouldComponentUpdate(nextProps, nextState); // Morearty logic
	}

	componentDidMount() {
		window.onresize = () => {
			this.setState({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};
	}

	/**
	 * Render the whole interface of the game
	 * @return {React.Element} the rendered element
	 */
	render() {
		var binding = this.getDefaultBinding();
		var width = this.state.width;
		var height = this.state.height;

		return (<Surface x={0} y={0} width={width} height={height}>
			<DiceReact x={10} y={10}
								 size={50}
								 binding={binding.sub('game.dice')}
								 ref="dice"	/>

			<MapReact ref="map"
								binding={binding.sub('game.board')}
								x={120} y={0}
								width={width - 120} height={height}
								margin={50}	/>

			<Message y={90} x={20}
							 binding={binding.sub('game.message')} />

			<PlayersInfo ref="player"
									 binding={{ default: binding.sub('players'), me: binding.sub('me') }}
									 y={120} x={20}
									 height={height} width={width} />

			{ this.displayEndTurn() ? <EndTurn x={width - 75} y={10} height={30} width={60} /> : null }
		</Surface>);
	}

	displayEndTurn() {
		var binding = this.getDefaultBinding();

		return binding.get('me.id') === binding.get('game.currentPlayerId') // it player's turn
			&& binding.get('step') === Globals.step.started;
	}
}

GameInterface.displayName = 'GameInterface';