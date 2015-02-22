require('../../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;

var MapHelper = require('../../libs/map');
var Tile = require('./TileReact');


describe('A basic map', () => {

  beforeEach(() => {
    this.data = new MapHelper({ tiles:[ { x: 0, y: 0, resource: 'tuile', diceValue: 1 }]});

    this.tile = utils.renderIntoDocument(<Tile tile={this.data.tiles[0]} />);

  });

  it('should represent the value of the dice', () => {
    expect(this.tile.refs.value).toBeDefined();
  });

});
