'use strict';

var unitSize = 60;
/**
 * Map helpher, transforming hexa coordinate to orthogonal. 
 */
class MapHelpher  {

  constructor(board, margin) {
    if(!board.tiles) {
      return {};
    }
    unitSize = getSize(board.tiles, window.innerHeight, window.innerWidth, margin);

    this.tiles = new Map();
    this.cities = new Map();
    this.paths = new Map();

    if(board.tiles) {
      for(let i = 0; i < board.tiles.length; i += 1) {
          this.tiles.set(board.tiles[i], new Tile(board.tiles[i]));    
      }
    }

    if(board.cities) {
      for(let i = 0; i < board.cities.length; i += 1) {
          this.cities.set(board.cities[i], new City(board.cities[i]));    
      }
    }

    if(board.paths) {
      for(let i = 0; i < board.paths.length; i += 1) {
          this.paths.set(board.paths[i], new Path(board.paths[i]));    
      }
    }
  }
}

/**
 * Get the size of one edge of a tiles
 * @param {Array} tiles of the game
 * @param {Integer} width of the map
 * @param {Integer} height of the map
 * @param {Integer} top and bottom margin of the map
 * @return {Integer} the size of one edge
 */
function getSize(tiles, width, height, margin) {
  var min = {
    x: 0,
    y: 0
  };
  var max = {
    x: 0,
    y: 0
  };

  var tmpWidth = 0, tmpHeight = 0, tmp = 0, size = 0;

  for(var i = 0; i < tiles.length; i += 1) {
    var t = tiles[i];
    for(var j in {x:'x', y:'y'}) {//jshint ignore:line
      
      if(t[j] > 0 && t[j] > max[j]) {
        max[j] = t[j];
      }

      if(t[j] < 0 && t[j] < min[j]) {
        min[j] = t[j];
      }
    }
  }

  tmpWidth = parseInt((width - margin) / ((max.x - min.x)), 10) ;
  tmpHeight = parseInt((height - margin) / ((max.y - min.y)), 10);

  tmp = convert(tmpWidth, tmpHeight, 1);
  if(tmp.x < tmp.y) {
    size = tmp.x;
  } else {
    size = tmp.y;
  }

  return size * 0.87;

}

/**
 * Get the size of one edge of a tiles
 * @param {Integer} x in hexacoordinate
 * @param {Integer} y in hexacoordinate
 * @param {Integer} size of the coordinate
 * @return {Object} new position in the orthogonal coordinate
 */
function convert(x, y, sz) {
  var size = typeof sz !== 'undefined' ? sz : unitSize;

  return {
    y: x * 0.87 * size, // sin(pi/3)
    x: (y + x / 2) * size
  };
}

//Abstract class for a map element
var index = 0;

class MapElement {
  constructor(element) {
    Object.assign(this, element);

    this.unitSize = unitSize;
    this.key = this.x + ',' + this.y + ',' + index;

    this.ortho = convert(this.x, this.y);
    index += 1;
  }
}
//A tile with orthogonal coordinate and vertex
class Tile extends MapElement {
  constructor(tile) {
    super(tile);
    //vertex
    this.vertex = [];
    this.vertex.push(convert(0, - 1));
    this.vertex.push(convert(1, - 1));
    this.vertex.push(convert(1, 0));
    this.vertex.push(convert(0, 1));
    this.vertex.push(convert(- 1, 1));
    this.vertex.push(convert(- 1, 0));
  }
}

//A city with orthogonal coordinate
class City extends MapElement {
  constructor(city) {
    super(city);
  }
}

//A path with orthogonal coordinate
class Path extends MapElement {
  constructor(path) {
    super(path);

    this.to = path.to;
    this.to.ortho = convert(this.to.x, this.to.y);

    this.from = path.from;
    this.from.ortho = convert(this.from.x, this.from.y);
  }
  
}

export default MapHelpher;