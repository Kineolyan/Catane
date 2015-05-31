import tests from 'client/js/components/libs/test';

import React from 'react/addons';
import Immutable from 'immutable';

import Room from 'client/js/components/parts/StartInterface/Room.react';

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

  it('should render the button with more than 2 players', function(done) {
      var binding = this._ctx.getBinding();
      var players = binding.get('players').toJS();
      players.deleteAll();
      players.createPlayer(1, 'bob', 'green');
      players.createPlayer(2, 'tom', 'yellow');
      players.createPlayer(3, 'mailis', 'blue');

      binding.set('players', Immutable.fromJS(players));

      setTimeout(() => {
          expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'start').length).toBe(1);
          done();
      }, 200);
  });


});