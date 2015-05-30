import tests from '../../libs/test';

import React from 'react/addons';
import Room from './Room.react';
import Player from './Player.react';

import Immutable from 'immutable';

var utils = React.addons.TestUtils;

describe('A room', function() {

  beforeEach(function() {
    this._ctx = tests.getCtx();
    var RoomB = this._ctx.bootstrap(Room);
    this.room= utils.renderIntoDocument(<RoomB />);

  });

  describe('should display the correct number of player', function() {

    it('#2 players', function(done) {
      var binding = this._ctx.getBinding();
      var players = binding.get('players').toJS();
      players.deleteAll();
      players.createPlayer(1, 'bob', 'green');
      players.createPlayer(2, 'tom', 'yellow');

      binding.set('players', Immutable.fromJS(players));
      setTimeout(() => {
        expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'player-elem').length).toBe(2);
        done();
      }, 100);
    });

    it('#3 players', function(done) {
      var binding = this._ctx.getBinding();
      var players = binding.get('players').toJS();
      players.deleteAll();
      players.createPlayer(1, 'bob', 'green');
      players.createPlayer(2, 'tom', 'yellow');
      players.createPlayer(3, 'lolo', 'blue');

      binding.set('players', Immutable.fromJS(players));
      setTimeout(() => {
        expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'player-elem').length).toBe(3);
        done();
      }, 100);
    });

  });

  it('shouldn\'t render start button when there are less than 2 players', function() {
      expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'start').length).toBe(0);
  });


});