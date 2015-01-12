require('../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;
var Room = require('./RoomReact');
var Player = require('./PlayerReact');


describe('A room', () => {

  beforeEach(() => {

    this.change = () => {};
    spyOn(this, 'change');

    this.player = utils.renderIntoDocument(<Player id={2} initialName='tom' canChangeName={true} onChange={this.change}/>);
    this.room = utils.renderIntoDocument(<Room game={2} player={this.player} />);
  });

  it('should have an initial player ', () => {
      expect(this.room.props.player.getId()).toEqual(2);
  });

  it('should render the list of players', (done) => {
    this.room.setState({players:[{
        id: 1, name: 'jean'
      }, {
        id: 2, name: 'tom', 
      }, {
        id: 3, name: 'marcel'
    }]}, () => {
      expect(utils.scryRenderedDOMComponentsWithClass(this.room, 'player-elem').length).toBe(3);
      done();
    });

  });

  afterEach(() => {
    React.unmountComponentAtNode(this.player.getDOMNode().parent);
    React.unmountComponentAtNode(this.room.getDOMNode().parent);
  });

});