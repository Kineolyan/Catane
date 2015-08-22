import React from 'react';
import { Group, Text } from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';

import { gameManager } from 'client/js/components/listener/listener';

export default class EndTurn extends React.Component {
	render() {
		return (
				<Group x={this.props.x} y={this.props.y}
				       onClick={this.endTurn.bind(this)}>
					<Rectangle x={0} y={0} height={this.props.height} width={this.props.width}
					           stroke='black' fill="#36a8ff"/>
					<Text x={5} y={5} fill="black" font={{ 'font-size': '12px' }}>
						End turn
					</Text>
				</Group>
		);
	}

	/**
	 * Ends the turn.
	 */
	endTurn() {
		gameManager().endTurn();
	}
}

EndTurn.defaultProps = {
	x: 0,
	y: 0,
	height: 20,
	width: 50
};

EndTurn.displayName = 'EndTurn';