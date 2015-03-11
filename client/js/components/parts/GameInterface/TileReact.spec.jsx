var tests = require('../../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;

var MapHelper = require('../../libs/map');
var Tile = require('./TileReact');
var Text = require('react-art').Text;

var Globals = require('../../libs/globals');

describe('A tile', () => {

  beforeEach(() => {
    this.data = new MapHelper({ tiles:[ { x: 0, y: 0, resource: 'tuile', diceValue: 1 }]});

    this.tile = utils.renderIntoDocument(<Tile tile={this.data.tiles[0]} />);

  });

  it('should represent the value of the dice', () => {
    var content = tests.getRenderedElements(this.tile, Text);
    expect(content.length).toEqual(1);
    expect(content[0].props.children).toEqual("1");
  });

  it('should have the correct color', () => {
    expect(this.tile.tileColor()).toEqual(Globals.map.resources.tuile);
  });

});
