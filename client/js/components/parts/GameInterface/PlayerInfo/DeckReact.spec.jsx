var tests = require('../../../libs/test');
var Globals = require('../../../libs/globals');

var React = require('react/addons');
var utils = React.addons.TestUtils;

var Deck = require('./DeckReact');
var Card = require('./CardReact');

describe('A deck', function() {

  beforeEach(function() {
    var cards = [{type: Globals.map.resourceName.tuile}, {type: Globals.map.resourceName.bois}];
    this.deck = utils.renderIntoDocument(<Deck cards={cards} />);
  });

  it('should have some cards', function() {
    expect(tests.getRenderedElements(this.deck, Card).length).toEqual(2);
  });

});