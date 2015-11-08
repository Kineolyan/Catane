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
import BuildColony from 'client/js/components/parts/GameInterface/actions/BuildColony.react.js';

import { Step } from 'client/js/components/libs/globals';
import Popup from 'client/js/components/parts/GameInterface/Elements/Popup.react';
import Rectangle from 'react-art/shapes/rectangle';

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

	getActions() {
		const { width, height } = this.state;
		const binding = this.getDefaultBinding();

		return [
			<EndTurn x={width - 75} y={10} height={30} width={60} />,
			<BuildColony binding={{ game: binding.sub('game'), me: binding.sub('me') }}
				 					 x={width - 90} y={50} height={30} width={75} />
		];
	}

	/**
	 * Render the whole interface of the game
	 * @return {React.Element} the rendered element
	 */
	render() {
		var binding = this.getDefaultBinding();
		const { width, height } = this.state;

		return (<Surface x={0} y={0} width={width} height={height}>
			<DiceReact x={10} y={10} size={50}
				startTime={100}
				binding={binding.sub('game.dice')}
				ref="dice"	/>

			<MapReact ref="map"
								binding={{ default: binding.sub('game.board'), players: binding.sub('players') }}
								x={120} y={0}
								width={width - 120} height={height}
								margin={50}	/>

			<Message y={90} x={20}
							 binding={binding.sub('game.message')} />

			<PlayersInfo ref="player"
									 binding={{ default: binding.sub('players'), me: binding.sub('me') }}
									 y={120} x={20}
									 height={height} width={width} />

			{ this.displayEndTurn() ? this.getActions() : null }
		</Surface>);
	}

	displayEndTurn() {
		var binding = this.getDefaultBinding();

		return binding.get('me.id') === binding.get('game.currentPlayerId') // it player's turn
			&& binding.get('step') === Step.started;
	}
}

GameInterface.displayName = 'GameInterface';
