import '../../libs/test';

import React from 'react/addons';
import Room from './Room.react';
import Player from './Player.react';

var utils = React.addons.TestUtils;

describe('A room', function() {

  beforeEach(function() {
    this.change = () => {};
    spyOn(this, 'change');


    this.player = utils.renderIntoDocument(<Player id={2} initialName='tom' canChangeName={true} onChange={this.change}/>);
    this.room = utils.renderIntoDocument(<Room game={{id: 3,name: 'game'}} player={this.player} onStart={this.change}/>);
  });

  it('should have an initial player ', function() {
      expect(this.room.props.player.getId()).toEqual(2);
  });

  it('should render the list of players', function(done) {
    var players = new Map();
    players.set(1, { id: 1, name: 'jean' });
    players.set(2, { id: 2, name: 'tom' });
    players.set(3, { id: 3, name: 'marcel' });
    this.room.setState({players: players}, () => {
      expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'player-elem').length).toBe(3);
      done();
    });
  });

  it('shouldn\'t render start button when there are less than 2 players', function() {
    expect(this.room.refs.startButton).toBeUndefined();
  });

  it('should render start button  when there 2 players or more', function(done) {
    var players = new Map();
    players.set(1, { id: 1, name: 'jean' });
    players.set(2, { id: 2, name: 'tom' });
    players.set(3, { id: 3, name: 'marcel' });
    this.room.setState({players: players}, () => {
      expect(this.room.refs.startButton).toBeDefined();
      done();
    });
  });

});