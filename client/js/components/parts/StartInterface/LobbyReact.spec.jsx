require('../../libs/test');

var React = require('react');
var ReactAddons = require('react/addons');
var utils = ReactAddons.addons.TestUtils;
var Lobby = require('./LobbyReact');

describe('A lobby', function() {

  beforeEach(function() {
    this.choose = function() {};
    spyOn(this, 'choose');

    this.lobby = utils.renderIntoDocument(<Lobby onGameChosen={this.choose} />);
    spyOn(this.lobby, 'chooseGame');
  });

  it('should be able to create a game', function(done) {
    var btn = this.lobby.refs.createGameBtn.getDOMNode();
    utils.Simulate.click(btn, { currentTarget: { dataset: 1 }});

    setTimeout(() => {
      expect(this.choose).toHaveBeenCalledWith({id: 1});
      done();
    }, 500);
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

  afterEach(function() {
    ReactAddons.unmountComponentAtNode(this.lobby.getDOMNode().parent);
  });
});