import tests from '../../../libs/test';
import MapHelper from '../../../common/map';

import React from 'react/addons';
import Immutable from 'immutable';

import MapReact from './Map.react';
import Tile from './Tile.react';
import Path from './Path.react';
import City from './City.react';

var utils = React.addons.TestUtils;


describe('A basic map', function() {

  beforeAll(function() {
    var self = this;

    this.initBoard = { tiles:[ { x: 0, y: 0, resource: 'tuile', diceValue: 1  },
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

    this.board = MapHelper.init(this.initBoard);
    
    this._ctx = tests.getCtx({board: Immutable.fromJS(this.board)});

    var proxy = React.createClass({

      render() {
        return (<MapReact binding={self._ctx.getBinding().sub('board')} />);
      }

    });

    var MapB = this._ctx.bootstrap(proxy);

    this.map = utils.renderIntoDocument(<MapB />);


  });

  it('should render the tiles', function() {
    expect(tests.getRenderedElements(this.map, Tile).length).toEqual(this.initBoard.tiles.length);
  });

  it('should render the cities', function() {
    expect(tests.getRenderedElements(this.map, City).length).toEqual(this.initBoard.cities.length);
  });

  it('should render the paths', function() {
    expect(tests.getRenderedElements(this.map, Path).length).toEqual(this.initBoard.paths.length);
  });

});
