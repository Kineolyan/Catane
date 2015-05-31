import tests from 'client/js/components/libs/test';
import Globals from 'client/js/components/libs/globals';

import React from 'react/addons';

import Deck from 'client/js/components/parts/GameInterface/PlayersInfo/Deck.react';
import Card from 'client/js/components/parts/GameInterface/PlayersInfo/Card.react';

var utils = React.addons.TestUtils;

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