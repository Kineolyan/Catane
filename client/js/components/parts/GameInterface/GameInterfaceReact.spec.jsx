require('../../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;
var GameInterface = require('./GameInterfaceReact');
var MapReact = require('./MapReact');

describe('A game interface', function() {

  beforeEach(function() {
    var board = {};

    this.game = utils.renderIntoDocument(<GameInterface board={board} />);

  });

  it('should have the full width', function() {
    expect(this.game.state.width).toEqual(window.innerWidth);
  });

  it('should have the full height', function() {
    expect(this.game.state.height).toEqual(window.innerHeight);
  });

  it('should have the map', function() {
    expect(this.game.refs.map).toBeDefined();
    expect(utils.isCompositeComponentWithType(this.game.refs.map, MapReact)).toBe(true);
  });

  afterEach(function() {
    React.unmountComponentAtNode(this.game.getDOMNode().parent);
  });
});