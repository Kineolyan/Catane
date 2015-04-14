import '../../libs/test';

import React from 'react/addons';

import StartInterface from './StartInterface.react';
import Globals from '../../libs/globals';
import Room from './Room.react';
import Lobby from './Lobby.react';

var utils = React.addons.TestUtils;

describe('The start interface', function() {

  beforeEach(function() {
    var data = {id: 'id', name: 'player'};

    this.start = () => {};
    spyOn(this, 'start');

    this.game = utils.renderIntoDocument(<StartInterface init={data} onStart={this.start}/>);
  });

  it('should start at the init step', function() {
    expect(this.game.state.step).toEqual(Globals.step.init);
  });

  it('should have the list of room when in chooseLobby', function() {
    this.game.setMinimalStep(Globals.step.chooseLobby);
    expect(utils.scryRenderedComponentsWithType(this.game, Lobby).length).toEqual(1);
  });

  it('should be able to set a minimal step', function(done) {
    this.game.setMinimalStep(Globals.step.started);

    setTimeout(() => {
      expect(this.game.state.step).toEqual(Globals.step.started);
      setTimeout(() => {
        this.game.setMinimalStep(Globals.step.inLobby);
        expect(this.game.state.step).toEqual(Globals.step.started);
        done();
      }, 500);
    }, 500);


  });

  it('should choose a game and go in room and then leave it', function() {
    this.game.chooseGame(2);

    expect(this.game.state.step).toEqual(Globals.step.inLobby);
    expect(this.game.state.game).toEqual(2);

    expect(utils.scryRenderedComponentsWithType(this.game, Room).length).toEqual(1);


    this.game.leaveRoom();
    expect(this.game.state.game).toEqual({});
  });

  it('should be able to start the game', function() {
    this.game.startGame();
    expect(this.start).toHaveBeenCalled();
  });

});