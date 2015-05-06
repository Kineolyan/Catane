import tests from '../../../libs/test';

import React from 'react/addons';
import PlayerInfo from './PlayersInfo.react';
import Deck from './Deck.react';

var utils = React.addons.TestUtils;

describe('A player in the game', function() {

  beforeEach(function() {
    this.player = utils.renderIntoDocument(<PlayerInfo />);
  });

  it('should have a deck of cards', function() {
    expect(tests.getRenderedElements(this.player, Deck).length).toEqual(1);
  });

});