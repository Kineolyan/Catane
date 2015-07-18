'use strict';

/*
 React component containing the whole game interface
 */

import reactBoostrap from 'react-bootstrap';

import React from 'react'; // eslint-disable-line no-unused-vars
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';
import Room from 'client/js/components/parts/StartInterface/Room.react';
import Player from 'client/js/components/parts/StartInterface/Player.react';
import Lobby from 'client/js/components/parts/StartInterface/Lobby.react';

var Jumbotron = reactBoostrap.Jumbotron;
var Grid = reactBoostrap.Grid;
var Row = reactBoostrap.Row;
var Col = reactBoostrap.Col;

export default class StartInterface extends MoreartyComponent {

	/**
	 * Render the interface of the selection of game
	 * @return {React.Element} the rendered element
	 */
	render() {

		var binding = this.getDefaultBinding();
		return (
				<div className={'start-interface'}>
					<Grid>
						<Row>
							<Col md={4} mdOffset={4}>
								<Jumbotron>
									<Player binding={binding}/>
									{this.renderChooseLobby()}
									{this.renderInLobby()}
								</Jumbotron>

							</Col>

						</Row>
					</Grid>

				</div>
		);
	}

	/**
	 * Render the lobby to choose and create a game
	 * @return {React.Element} the rendered element
	 */
	renderChooseLobby() {
		var binding = this.getDefaultBinding();
		if (!binding.get('start.gameChosen.id')) {
			return (<Lobby binding={binding}/>);
		}
	}

	/**
	 * Render the inLobby to wait before launching the game
	 * @return {React.Element} the rendered element
	 */
	renderInLobby() {
		var binding = this.getDefaultBinding();

		if (binding.get('start.gameChosen.id')) {
			return (<Room binding={binding}/>);
		}
	}

}

StartInterface.displayName = 'StartInterface';
