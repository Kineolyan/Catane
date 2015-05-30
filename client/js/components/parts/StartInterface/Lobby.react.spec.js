import tests from '../../libs/test';

import React from 'react/addons';
import Lobby from './Lobby.react';
import Immutable from 'immutable';

var utils = React.addons.TestUtils;


describe('A lobby', function() {

  beforeEach(function() {

    this._ctx = tests.getCtx();
    var binding = this._ctx.getBinding();

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