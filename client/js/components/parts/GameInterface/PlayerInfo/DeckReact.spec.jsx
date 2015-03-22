var tests = require('../../../libs/test');
var Globals = require('../../../libs/globals');

var React = require('react/addons');
var utils = React.addons.TestUtils;

var Deck = require('./DeckReact');
var Card = require('./CardReact');

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