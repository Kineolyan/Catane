require('../../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;
var Lobby = require('./LobbyReact');



describe('A lobby', () => {

  beforeEach(() => {

    this.chooseGame = () => {};
    spyOn(this, 'chooseGame');

    this.lobby = utils.renderIntoDocument(<Lobby onGameChosen={this.chooseGame} />);
    spyOn(this.lobby, 'chooseGame');
  });

  it('should be able to create a game', (done) => {
      utils.Simulate.click(this.lobby.refs.createGame.getDOMNode());
      setTimeout(() => {
        expect(this.chooseGame).toHaveBeenCalledWith({id : jasmine.any(Number) });
        done();
      }, 300);
  });

  it('should render the list of game and be able to choose one', (done) => {
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

  afterEach(() => {
    React.unmountComponentAtNode(this.lobby.getDOMNode().parent);
  });
});