import '../libs/test';

import React from 'react/addons';
import Game from './Game.react';
import  StartInterface from './StartInterface/StartInterface.react';

var utils = React.addons.TestUtils;

describe('A game', function() {

  beforeEach(function() {
    var data = { player: {id: 'id', name: 'player'} };

    this.game = utils.renderIntoDocument(<Game init={data}/>);
  });

  it('should start with the start interface', function() {
      expect(this.game.state.started).toBe(false);
      expect(utils.scryRenderedComponentsWithType(this.game, StartInterface).length).toBe(1);
  });

  it('should remove the start interface when it started', function(done) {
      this.game.setState({started: true}, () => {
        expect(utils.scryRenderedComponentsWithType(this.game, StartInterface).length).toBe(0);
        done();
      });
  });

});