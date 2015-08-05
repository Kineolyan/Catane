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

const MARGIN = 10;

export default class GameInterface extends MoreartyComponent {

	constructor() {
		super(...arguments);

		this.state = {
			width: window.innerWidth,
			height: window.innerHeight
		};
	}

	componentDidMount() {
		window.onresize = () => {
			this.setState('width', window.innerWidth);
			this.setState('height', window.innerHeight);
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
		var unit = GameInterface.computeUnit(binding.get('game.board.tiles'), width, height, MARGIN);

		return (<Surface x={0} y={0} width={width} height={height}>
			<DiceReact x={10} y={10}
			           size={50}
			           binding={binding.sub('game.dice')}
			           ref="dice"
					/>

			<MapReact ref="map"
			          binding={binding.sub('game.board')}
			          width={width} height={height} unit={unit}
			          margin={50}
					/>

			<Message y={90} x={20}
			         binding={binding.sub('game.message')}
					/>

			<PlayersInfo ref="player"
			             binding={{ default: binding.sub('players'), me: binding.sub('me') }}
			             y={120} x={20}
			             height={height} width={width}
					/>

			{ this.displayEndTurn() ? <EndTurn x={width - 75} y={10} height={30} width={60} /> : null }
		</Surface>);
	}

	displayEndTurn() {
		var binding = this.getDefaultBinding();

		return binding.get('me.id') === binding.get('game.currentPlayerId') // it player's turn
			&& binding.get('step') === Globals.step.started;
	}

	/**
	 * Get the unit size of one edge of a tiles
	 * @param {Array} binding of the tiles of the game
	 * @param {Number} width width of the map
	 * @param {Number} height height of the map
	 * @param {Number} margin top and bottom margin of the map
	 * @return {Number} the size of one edge
	 */
	static computeUnit(tiles, width, height, margin) {
		var min = {	x: 0,	y: 0 };
		var max = { x: 0, y: 0 };
		tiles.forEach(tile => {
			for (let axis of ['x', 'y']) {
				let value = tile.get(axis);
				if (value > 0 && value > max[axis]) {
					max[axis] = value;
				}

				if (value < 0 && value < min[axis]) {
					min[axis] = value;
				}
			}
		});

		var xUnit = parseInt((width - margin) / (max.x - min.x), 10);
		var yUnit = parseInt((height - margin) / (max.y - min.y), 10);
		return Math.min(xUnit, yUnit);
	}
}

GameInterface.displayName = 'GameInterface';