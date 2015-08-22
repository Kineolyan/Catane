'use strict';

/*
 React component containing the card
 */
import { Board } from 'client/js/components/libs/globals';
import { gameManager } from 'client/js/components/listener/listener';

import React from 'react';
import { Group, Text } from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';


export default class Card extends React.Component {

	/**
	 * @return {React.Element} the rendered element
	 */
	render() {
		const y = this.props.isSelected ? this.props.y - 10 : this.props.y;
		return (
				<Group x={this.props.x} y={y} width={this.props.width} height={this.props.height}
					onClick={this.selectCard.bind(this)}>
					<Rectangle
							width={this.props.width} height={this.props.height}
							stroke="black" fill={Board.resources[this.props.type]} />
					<Text fill="black" y={6} x={this.props.width / 2} alignment="center"
					      font={{ 'font-size': '12px' }}>{this.props.type}</Text>
				</Group>
		);
	}

	selectCard() {
		gameManager().selectCard(this.props.type, this.props.index);
	}
}

Card.propTypes = {
	type: React.PropTypes.string.isRequired,
	index: React.PropTypes.number.isRequired,
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	x: React.PropTypes.number,
	y: React.PropTypes.number
};

Card.defaultProps = {
	x: 0,
	y: 0,
	width: 40,
	height: 40
};

Card.displayName = 'Card';