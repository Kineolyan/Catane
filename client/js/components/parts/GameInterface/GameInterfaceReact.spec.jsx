require('../../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;
var GameInterface = require('./GameInterfaceReact');
var MapReact = require('./MapReact');


describe('A game interface', () => {

  beforeEach(() => {
    var board = {};

    this.game = utils.renderIntoDocument(<GameInterface board={board} />);

  });

  it('should have the map', () => {
    console.log(this.game);
    expect(utils.scryRenderedComponentsWithType(this.game, MapReact).length).toEqual(1);
  });

  afterEach(() => {
    React.unmountComponentAtNode(this.game.getDOMNode().parent);
  });
});