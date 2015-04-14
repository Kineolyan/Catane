import '../../libs/test';

import React from 'react';
import ReactAddons from 'react/addons';
import Lobby from './Lobby.react';

var utils = ReactAddons.addons.TestUtils;


describe('A lobby', function() {

  beforeEach(function() {
    this.choose = function() {};
    spyOn(this, 'choose');

    this.lobby = utils.renderIntoDocument(<Lobby onGameChosen={this.choose} />);
    spyOn(this.lobby, 'chooseGame');
  });


  it('should render the list of game and be able to choose one', function(done) {
      this.lobby.setState({gameAvailables:[{
        id: 1
      }, {
        id: 2
      }]}, () => {
        var elems = utils.scryRenderedDOMComponentsWithClass(this.lobby, 'game-elem');

        expect(elems.length).toBe(2);

        utils.Simulate.click(elems[0].getDOMNode());
        expect(this.lobby.chooseGame).toHaveBeenCalled();

        done();
    });
  });

});