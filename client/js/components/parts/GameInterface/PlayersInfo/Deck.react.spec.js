import tests from 'client/js/components/libs/test';
import Globals from 'client/js/components/libs/globals';

import React from 'react/addons';

import Deck from 'client/js/components/parts/GameInterface/PlayersInfo/Deck.react';
import Card from 'client/js/components/parts/GameInterface/PlayersInfo/Card.react';

var utils = React.addons.TestUtils;

describe('A deck', function() {

	beforeEach(function() {
		var cards = [{ type: Globals.map.resourceName.tuile }, { type: Globals.map.resourceName.bois }];
    this.widthOfACard = 20;
    this.space = 0;
		this.deck = utils.renderIntoDocument(<Deck cards={cards} width={200} spaceBetweenCards={this.space} widthOfACard={this.widthOfACard} />);

		this.renderedCards = tests.getRenderedElements(this.deck, Card);
	});

	it('should have some cards', function() {
		expect(this.renderedCards.length).toEqual(2);
	});

	it('should have the cards stacked', function() {
		var sum = (this.renderedCards.length - 1) * this.space + this.widthOfACard;
		expect(sum).toEqual(20);
	});

	describe('with space', function() {
		beforeEach(function() {
			var cards = [{ type: Globals.map.resourceName.tuile }, { type: Globals.map.resourceName.bois }];
      this.widthOfACard = 20;
      this.space = 10;
			this.deck = utils.renderIntoDocument(<Deck cards={cards} width={200} spaceBetweenCards={this.space} widthOfACard={this.widthOfACard} />);

			this.renderedCards = tests.getRenderedElements(this.deck, Card);
		});

		it('should have the cards stacked', function() {
			var sum = (this.renderedCards.length - 1) * this.space + this.widthOfACard;
			expect(sum).toEqual(30);
		});
	});

});