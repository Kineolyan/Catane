import tests from 'client/js/components/libs/test';

import React from 'react/addons';
import Immutable from 'immutable';

import Lobby from 'client/js/components/parts/StartInterface/Lobby.react';

var utils = React.addons.TestUtils;


describe('A lobby', function() {

  beforeEach(function() {

    this._ctx = tests.getCtx();
    
    var LobbyB = this._ctx.bootstrap(Lobby);

    this.lobby = utils.renderIntoDocument(<LobbyB />);

  });


  it('should render the list of game', function(done) {
    var binding = this._ctx.getBinding();
    binding.set('start.games', Immutable.fromJS([{id: 1}, {id: 2}]));
    
    setTimeout(() => {
        var elems = utils.scryRenderedDOMComponentsWithClass(this.lobby, 'game-elem');
        expect(elems.length).toBe(2);
        done();
    }, 100);
    
  });

});