import tests from 'client/js/components/libs/test';
import Globals from 'client/js/components/libs/globals';

import React from 'react/addons'; // eslint-disable-line no-unused-vars

import Deck from 'client/js/components/parts/GameInterface/PlayersInfo/Deck.react';
import Card from 'client/js/components/parts/GameInterface/PlayersInfo/Card.react';

var cardWidth = 20;
var spaceBetweenCards = 0;

class TestRoot extends tests.Wrapper {
	render() {
		return (<Deck binding={this.binding.sub('resources')} width={200}
		              spaceBetweenCards={spaceBetweenCards}
		              widthOfACard={cardWidth}/>);
	}
}

describe('<Deck>', function() {
	beforeEach(function() {
		this.ctx = tests.getCtx({ resources: [
			Globals.map.resourceName.tuile,
			Globals.map.resourceName.bois
		] });

		this.deck = tests.bootstrap(this.ctx, TestRoot);
		this.renderedCards = tests.getRenderedElements(this.deck, Card);
	});

	it('should have some cards', function() {
		expect(this.renderedCards).toHaveLength(2);
	});

	it('should have the cards stacked', function() {
		var sum = (this.renderedCards.length - 1) * spaceBetweenCards + cardWidth;
		expect(sum).toEqual(20);
	});

	describe('with space', function() {
		beforeEach(function() {
			cardWidth = 20;
			spaceBetweenCards = 10;
			this.deck = tests.bootstrap(this.ctx, TestRoot);
			this.renderedCards = tests.getRenderedElements(this.deck, Card);
		});

		it('should have the cards stacked', function() {
			var sum = (this.renderedCards.length - 1) * spaceBetweenCards + cardWidth;
			expect(sum).toEqual(30);
		});
	});

});