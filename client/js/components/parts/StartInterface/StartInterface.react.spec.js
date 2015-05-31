import tests from '../../libs/test';

import React from 'react/addons';

import StartInterface from './StartInterface.react';
import Room from './Room.react';
import Lobby from './Lobby.react';
import Player from './Player.react';

var utils = React.addons.TestUtils;

describe('The start interface', function() {

  beforeEach(function() {
    
    this._ctx = tests.getCtx();
    var StartInterfaceB = this._ctx.bootstrap(StartInterface);
    this.start= utils.renderIntoDocument(<StartInterfaceB />);

  });

  it('should render the player', function() {
    expect(utils.scryRenderedComponentsWithType(this.start, Player).length).toEqual(1);
  });

  it('should render the lobby when no game are chosen', function() {
    expect(utils.scryRenderedComponentsWithType(this.start, Lobby).length).toEqual(1);
  });

  it('should render the room when a game is chosen', function(done) {
    this._ctx.getBinding().set('start.gameChosen.id', 1);
    setTimeout(() => {
      expect(utils.scryRenderedComponentsWithType(this.start, Room).length).toEqual(1);
      done();
    }, 200);

  });

});