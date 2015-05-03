import '../../libs/test';

import React from 'react/addons';
import GameInterface from './GameInterface.react';
import MapReact from './Map/Map.react';

var utils = React.addons.TestUtils;

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

});