import tests from '../../../libs/test';
import Globals from '../../../libs/globals';

import React from 'react/addons';
var utils = React.addons.TestUtils;

import Deck from './Deck.react';
import Card from './Card.react';

describe('A deck', function() {

  beforeEach(function() {
    var cards = [{type: Globals.map.resourceName.tuile}, {type: Globals.map.resourceName.bois}];
    this.deck = utils.renderIntoDocument(<Deck cards={cards} width={200} margin={0}/>);

    this.renderedCards = tests.getRenderedElements(this.deck, Card);
  });

  it('should have some cards', function() {
    expect(this.renderedCards.length).toEqual(2);
  });

  it('should have the same width as all the cards', function() {
    var sum = this.renderedCards.reduce((prev, current) => {
      return prev + current.props.width;
    }, 0);
    expect(sum).toEqual(200);
  });

  describe('with margins', function() {
    beforeEach(function() {
      var cards = [{type: Globals.map.resourceName.tuile}, {type: Globals.map.resourceName.bois}];
      this.deck = utils.renderIntoDocument(<Deck cards={cards} width={200} margin={10}/>);

      this.renderedCards = tests.getRenderedElements(this.deck, Card);
    });

    it('should have the same width as all the cards plus their margins', function() {
      
      var sum = this.renderedCards.reduce((prev, current) => {
        return prev + current.props.width + 10;
      }, 0);

      expect(sum).toEqual(200);
    });
  });

});