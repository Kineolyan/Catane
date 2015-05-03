import tests from '../../../libs/test';

import React from 'react/addons';

import MapHelper from '../../../libs/map';
import Tile from './Tile.react';
import {Text} from 'react-art';
import Globals from '../../../libs/globals';

var utils = React.addons.TestUtils;

describe('A tile', function() {

  beforeEach(function() {
    var val = { x: 0, y: 0, resource: 'tuile', diceValue: 1 };
    var data = new MapHelper({ tiles:[val]});

    this.tile = utils.renderIntoDocument(<Tile tile={data.tiles.get(val)} />);
  });

  it('should represent the value of the dice', function() {
    var content = tests.getRenderedElements(this.tile, Text);
    expect(content.length).toEqual(1);
    expect(content[0].props.children).toEqual("1");
  });

  it('should have the correct color', function() {
    expect(this.tile.tileColor()).toEqual(Globals.map.resources.tuile);
  });

  describe('Desert tile', function() {
    beforeEach(function() {
      var val = { x: 0, y: 0, resource: 'desert', diceValue: null };
      var data = new MapHelper({ tiles:[val]});
      this.desertTile = utils.renderIntoDocument(<Tile tile={ data.tiles.get(val) } />);
    });

    it('does not diplay dice value', function() {
      var content = tests.getRenderedElements(this.desertTile, Text);
      expect(content).toBeEmpty();
    });

    it('has color for desert', function() {
      expect(this.desertTile.tileColor()).toEqual(Globals.map.resources.desert);
    });
  });

});
