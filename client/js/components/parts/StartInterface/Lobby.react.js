'use strict';

/*
 React component containing the lobby to choose the same
 */

import reactBootstrap from 'react-bootstrap';

import React from 'react'; // eslint-disable-line no-unused-vars
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

import { startManager } from 'client/js/components/listener/listener';

var Button = reactBootstrap.Button;
var Glyphicon = reactBootstrap.Glyphicon;

export default class Lobby extends MoreartyComponent {

	/**
	 * Triggered when the component is rendered, initialize the componenent
	 */
	componentDidMount() {
		startManager().askGameList();
	}

	/**
	 * Render the lobby interface
	 * @return {Object} the rendered element
	 */
	render() {
		var binding = this.getDefaultBinding();

		var games = binding.get('start.games').map((game) => {
			var gameId = game.get('id');
			return (<li className={'game-elem'} key={gameId} data-id={gameId}
			            onClick={this.chooseGame.bind(this)}>
				Join Game {gameId} <Glyphicon glyph="arrow-right"/>
			</li>);
		});

		const noGame = (<div>No games available. Create one to start !</div>);

		return (
				<div className={'lobby'}>
					<ul className={'list-info'}>
						{!games.isEmpty() ? games.toArray() : noGame}
					</ul>
					<Button className={'pull-right'} bsSize="small" bsStyle="success" ref="createGameBtn"
					        onClick={this.createGame.bind(this)}>
						Create game <Glyphicon glyph="plus-sign"/>
					</Button>

				</div>
		);
	}

	/**
	 * Ask to create a game
	 */
	createGame() {
		startManager().createGame();
	}

	/**
	 * Callback when we choose a game
	 * @param  {Event} event the click event
	 */
	chooseGame(event) {
		var gameId = parseInt(event.currentTarget.dataset.id, 10);
		startManager().joinGame(gameId);
	}
}

Lobby.displayName = 'Lobby';
