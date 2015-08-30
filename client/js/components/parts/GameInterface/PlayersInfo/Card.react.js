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

	constructor() {
		super(...arguments);

		this.state = { mouseIn: false };
	}
	/**
	 * @return {React.Element} the rendered element
	 */
	render() {
		const y = this.state.mouseIn ? this.props.y - 10 : this.props.y;
		return (
				<Group x={this.props.x}
							 y={y}
							 width={this.props.width}
							 height={this.props.height}
							 onClick={this.selectCard.bind(this)}
							 onMouseOver={this.mouseEnter.bind(this)}
							 onMouseOut={this.mouseLeave.bind(this)} >

							 <Rectangle width={this.props.width}
													height={this.props.height}
													stroke="black"
													fill={Board.resources[this.props.type]} />

								<Text fill="black"
											y={6}
											x={this.props.width / 2}
											alignment="center"
											font={{ 'font-size': '12px' }}>

											{this.props.type}
							 </Text>
				</Group>
		);
	}

	mouseEnter() {
		this.setState({ mouseIn: true });
		if(this.props.onHovered) {
			this.props.onHovered(this.props.index);
		}
	}

	mouseLeave() {
		this.setState({ mouseIn: false });
	}

	selectCard() {
		gameManager().selectCard(this.props.type, this.props.index);
	}
}

Card.propTypes = {
	type: React.PropTypes.string.isRequired,
	index: React.PropTypes.number.isRequired,
	onHovered: React.PropTypes.func,
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