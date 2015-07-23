'use strict';

/*
 React component containing the cards
 */

import React from 'react';
import { Group } from 'react-art';

import Card from 'client/js/components/parts/GameInterface/PlayersInfo/Card.react';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

export default class Deck extends MoreartyComponent {

	/**
	 * @return {React.Element} the rendered element
	 */
	render() {
		var deck = this.getDefaultBinding().get();
		var deckLength = deck.size;
		var width = this.props.width;
		var height = this.props.height;
		var size = width / (deckLength) - this.props.margin * (deckLength - 1);

		var cards = deck.map((card, index) => {
			return <Card
					type={card}
					x={(size + this.props.margin) * index} y={0}
					width={size} height={height}
					key={index} />;
		});

		return (
				<Group x={this.props.x} y={this.props.y} width={width} height={height}>
					{cards}
				</Group>
		);
	}
}

Deck.propTypes = {
	cards: React.PropTypes.any.isRequired,
	margin: React.PropTypes.number,
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	x: React.PropTypes.number,
	y: React.PropTypes.number
};

Deck.defaultProps = {
	cards: [],
	margin: 10,
	width: 200,
	height: 40,
	x: 0,
	y: 0
};

Deck.displayName = 'Deck';