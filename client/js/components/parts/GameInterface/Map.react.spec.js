import tests from '../../libs/test';

import React from 'react/addons';

import MapReact from './Map.react';
import Tile from './Tile.react';
import Path from './Path.react';
import City from './City.react';

var utils = React.addons.TestUtils;


describe('A basic map', function() {

  beforeEach(function() {
    this.board = { tiles:[ { x: 0, y: 0, resource: 'tuile', diceValue: 1  },
                         { x: 1, y: 1, resource: 'tuile', diceValue: 1  },
                         { x: 2, y: -1, resource: 'tuile', diceValue: 1  },
                         { x: 1, y: -2, resource: 'tuile', diceValue: 1  },
                         { x: -1, y: -1, resource: 'tuile', diceValue: 1  },
                         { x: -2, y: 1, resource: 'tuile', diceValue: 1  },
                         { x: -1, y: 2, resource: 'tuile', diceValue: 1  } ],
                      cities:
                       [ { x: 0, y: 1 },
                         { x: 1, y: 0 },
                         { x: 1, y: -1 },
                         { x: 0, y: -1 },
                         { x: -1, y: 0 },
                         { x: -1, y: 1 },
                         { x: 1, y: 2 },
                         { x: 2, y: 1 },
                         { x: 2, y: 0 },
                         { x: 0, y: 2 },
                         { x: 3, y: -1 },
                         { x: 3, y: -2 },
                         { x: 2, y: -2 },
                         { x: 2, y: -3 },
                         { x: 1, y: -3 },
                         { x: 0, y: -2 },
                         { x: -1, y: -2 },
                         { x: -2, y: -1 },
                         { x: -2, y: 0 },
                         { x: -2, y: 2 },
                         { x: -3, y: 1 },
                         { x: -3, y: 2 },
                         { x: -1, y: 3 },
                         { x: -2, y: 3 } ],
                      paths:
                       [ { from: { x: 1, y: 0 }, to: { x: 0, y: 1 } },
                         { from: { x: 1, y: -1 }, to: { x: 1, y: 0 } },
                         { from: { x: 0, y: -1 }, to: { x: 1, y: -1 } },
                         { from: { x: 0, y: -1 }, to: { x: -1, y: 0 } },
                         { from: { x: -1, y: 0 }, to: { x: -1, y: 1 } },
                         { from: { x: -1, y: 1 }, to: { x: 0, y: 1 } },
                         { from: { x: 2, y: 1 }, to: { x: 1, y: 2 } },
                         { from: { x: 2, y: 0 }, to: { x: 2, y: 1 } },
                         { from: { x: 1, y: 0 }, to: { x: 2, y: 0 } },
                         { from: { x: 0, y: 1 }, to: { x: 0, y: 2 } },
                         { from: { x: 0, y: 2 }, to: { x: 1, y: 2 } },
                         { from: { x: 3, y: -1 }, to: { x: 2, y: 0 } },
                         { from: { x: 3, y: -2 }, to: { x: 3, y: -1 } },
                         { from: { x: 2, y: -2 }, to: { x: 3, y: -2 } },
                         { from: { x: 2, y: -2 }, to: { x: 1, y: -1 } },
                         { from: { x: 2, y: -3 }, to: { x: 2, y: -2 } },
                         { from: { x: 1, y: -3 }, to: { x: 2, y: -3 } },
                         { from: { x: 1, y: -3 }, to: { x: 0, y: -2 } },
                         { from: { x: 0, y: -2 }, to: { x: 0, y: -1 } },
                         { from: { x: -1, y: -2 }, to: { x: 0, y: -2 } },
                         { from: { x: -1, y: -2 }, to: { x: -2, y: -1 } },
                         { from: { x: -2, y: -1 }, to: { x: -2, y: 0 } },
                         { from: { x: -2, y: 0 }, to: { x: -1, y: 0 } },
                         { from: { x: -1, y: 1 }, to: { x: -2, y: 2 } },
                         { from: { x: -2, y: 0 }, to: { x: -3, y: 1 } },
                         { from: { x: -3, y: 1 }, to: { x: -3, y: 2 } },
                         { from: { x: -3, y: 2 }, to: { x: -2, y: 2 } },
                         { from: { x: 0, y: 2 }, to: { x: -1, y: 3 } },
                         { from: { x: -2, y: 2 }, to: { x: -2, y: 3 } },
                         { from: { x: -2, y: 3 }, to: { x: -1, y: 3 } } ] };

    this.map = utils.renderIntoDocument(<MapReact board={this.board} margin={10} />);

  });

  it('should render the tiles', function() {
    expect(tests.getRenderedElements(this.map, Tile).length).toEqual(this.board.tiles.length);
  });

  it('should render the cities', function() {
    expect(tests.getRenderedElements(this.map, City).length).toEqual(this.board.cities.length);
  });

  it('should render the paths', function() {
    expect(tests.getRenderedElements(this.map, Path).length).toEqual(this.board.paths.length);
  });

});
