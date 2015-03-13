require('../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;
var Game = require('./GameReact');
var StartInterface = require('./StartInterface/StartInterfaceReact');

describe('A game', function() {

  beforeEach(function() {
    var data = {id: 'id', name: 'player'};

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

  afterEach(function() {
    React.unmountComponentAtNode(this.game.getDOMNode().parent);
  });

});