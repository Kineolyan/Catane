var tests = require('../../../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;
var PlayerInfo = require('./PlayerInfoReact');
var Deck = require('./DeckReact');

describe('A player in the game', function() {

  beforeEach(function() {
    this.player = utils.renderIntoDocument(<PlayerInfo />);
  });

  it('should have a deck of cards', function() {
    expect(tests.getRenderedElements(this.player, Deck).length).toEqual(1);
  });

});