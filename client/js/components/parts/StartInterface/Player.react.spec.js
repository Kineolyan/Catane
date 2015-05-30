import tests from '../../libs/test';

import React from 'react/addons';
import Player from './Player.react';

import Immutable from 'immutable';

var utils = React.addons.TestUtils;

describe('A player', function() {

  beforeEach(function() {
    this._ctx = tests.getCtx();


    var binding = this._ctx.getBinding();
    var players = binding.get('players').toJS();

    players.deleteAll();
    players.myId = 1;
    players.createPlayer(1, 'tom', 'green');

    binding.set('players', Immutable.fromJS(players));

  });

  it('should have a name', function(done) {
    setTimeout(() => {
      var PlayerB = this._ctx.bootstrap(Player);
      expect(React.renderToStaticMarkup(<PlayerB />)).toMatch(/tom/);
      done();
    }, 100);
  });

});