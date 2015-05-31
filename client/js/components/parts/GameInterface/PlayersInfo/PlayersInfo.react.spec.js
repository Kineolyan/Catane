import tests from '../../../libs/test';

import React from 'react/addons';
import PlayersInfo from './PlayersInfo.react';
import Deck from './Deck.react';
import OtherPlayer from './OtherPlayer.react';
import {Text} from 'react-art';
import Immutable from 'immutable';

var utils = React.addons.TestUtils;

describe('A player in the game', function() {

  beforeAll(function() {
    this._ctx = tests.getCtx();


    var binding = this._ctx.getBinding();
    var players = binding.get('players').toJS();

    players.deleteAll();
    players.myId = 1;
    players.createPlayer(1, 'tom', 'green');
    players.createPlayer(2, 'bob', 'yellow');
    players.createPlayer(3, 'lolo', 'blue');

    binding.set('players', Immutable.fromJS(players));

    var PlayersInfoB = this._ctx.bootstrap(PlayersInfo);

    this.player= utils.renderIntoDocument(<PlayersInfoB />);

  });

  it('should have a deck of cards', function() {
    expect(tests.getRenderedElements(this.player, Deck).length).toEqual(1);
  });

  it('render the other player', function() {
    expect(tests.getRenderedElements(this.player, OtherPlayer).length).toEqual(2);
  });

  it('have the good name for the current player', function() {
    expect(tests.getRenderedElements(this.player, Text)[0]._store.props.children).toBe('tom');
  });

});