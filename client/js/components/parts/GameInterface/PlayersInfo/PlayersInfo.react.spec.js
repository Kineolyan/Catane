import tests from '../../../libs/test';

import React from 'react/addons';
import PlayerInfo from './PlayersInfo.react';
import Deck from './Deck.react';
import OtherPlayer from './OtherPlayer.react';

var utils = React.addons.TestUtils;

describe('A player in the game', function() {

  beforeEach(function() {
    var players = {other: [{name: 'Bob', id: 3}, {name: 'Lili', id: 5}], me: {name: 'Tom', id: 2}};
    this.player = utils.renderIntoDocument(<PlayerInfo players={players} />);
  });

  it('should have a deck of cards', function() {
    expect(tests.getRenderedElements(this.player, Deck).length).toEqual(1);
  });

  it('render the other player', function() {
    expect(tests.getRenderedElements(this.player, OtherPlayer).length).toEqual(2);
  });

  it('have the good name for the current player', function() {
    expect(this.player.refs.name).toBeDefined();
    expect(this.player.refs.name).toContainText('Tom');
  });

});