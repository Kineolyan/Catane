'use strict';

/*
 React component containing the cards
 */

import React from 'react';
import { Group } from 'react-art';
import { Spring } from 'react-motion';

import Card from 'client/js/components/parts/GameInterface/PlayersInfo/Card.react';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

export default class Deck extends MoreartyComponent {

	constructor() {
		super(...arguments);

		this.state = { hoveredCard: -1, mouseIn: false };
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state !== nextState || super.shouldComponentUpdate(nextProps, nextState); // New definition to accept a local state
	}

	/**
	 * The goal is to draw something like this:
	 *
	 * _______________
	 * | | | | | |   |
	 * |_|_|_|_|_|___|
	 *
	 * @return {React.Element} the rendered element
	 */
	render() {
		const deck = this.getDefaultBinding().get();
		const deckLength = deck.size;
		const width = this.props.width;
		const height = this.props.height;
		const y = this.props.y;
		let selectedElement = null;

		// generate cards
		// TODO: handle case of too much cards (reduce spaceBetweenCard)
		const center = this.props.width / 2;
		const widthOfACard = this.props.widthOfACard;
		const totalSize = (deckLength - 1) * this.props.spaceBetweenCards + widthOfACard;
		const space = this.props.spaceBetweenCards;

		var cards = deck.map((cardBinding, index) => {
			const xCard = center - totalSize / 2 + space * index;

			const card = (<Card key={index}
													index={index}
													x={xCard}
													y={0}
													width={widthOfACard}
													height={height}
													type={cardBinding}
													onHovered={this.hoverCard.bind(this)} />
			);

			if (index === this.state.hoveredCard) {
				selectedElement = card;
			}

			return card;
		}).toArray();

		if (selectedElement) {
			cards.splice(cards.indexOf(selectedElement), 1);
			cards.push(selectedElement);
		}

		return (
				<Spring endValue={this.state.mouseIn ? 0 : height * 3 / 4 }>
					{val => <Group x={this.props.x}
													y={y + val}
													width={width}
													height={height}
													onMouseOver={this.mouseEnter.bind(this)}
													onMouseOut={this.mouseLeave.bind(this)} >
													{cards}
									</Group>

					}
				</Spring>
		);
	}

	// TODO: Implement as mixin, see Map/Element.react
	mouseEnter() {
		window.document.body.style.cursor = 'pointer';
		this.setState({ mouseIn: true });
	}

	mouseLeave() {
		window.document.body.style.cursor = 'auto';
		this.setState({ hoveredCard: -1, mouseIn: false });
	}

	hoverCard(index = 0) {
		this.setState({ hoveredCard: index });
	}
}

Deck.propTypes = {
	cards: React.PropTypes.any.isRequired,
	spaceBetweenCards: React.PropTypes.number,
	widthOfACards: React.PropTypes.number,
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	x: React.PropTypes.number,
	y: React.PropTypes.number
};

Deck.defaultProps = {
	cards: [],
	spaceBetweenCards: 30,
	widthOfACard: 80,
	width: 200,
	height: 40,
	x: 0,
	y: 0
};

Deck.displayName = 'Deck';
