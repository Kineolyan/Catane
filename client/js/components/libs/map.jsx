'use strict';

var unitSize = 60;
var MapHelpher = function(board, margin) {
  unitSize = getSize(board.tiles, window.innerHeight, window.innerWidth, margin);

  this.tiles = [];
  this.cities = [];
  this.paths = [];

  if(board.tiles) {
    for(var i = 0; i < board.tiles.length; i += 1) {
        this.tiles.push(new Tile(board.tiles[i]));    
    }
  }

  if(board.cities) {
    for(var j = 0; j < board.cities.length; j += 1) {
        this.cities.push(new City(board.cities[j]));    
    }
  }

  if(board.paths) {
    for(var k = 0; k < board.paths.length; k += 1) {
        this.paths.push(new Path(board.paths[k]));    
    }
  }
};

//Size finder
function getSize(tiles, width, height, margin) {
  var min = {
    x: 0,
    y: 0
  };
  var max = {
    x: 0,
    y: 0
  };

  var tmpWidth, tmpHeight, tmp, size;

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
  console.log(tmp);
  if(tmp.x < tmp.y) {
    size = tmp.x;
  } else {
    size = tmp.y;
  }

  return size * 0.87;

}

function convert(x, y, sz) {
  var size = typeof sz !== 'undefined' ? sz : unitSize;

  return {
    y: x * 0.87 * size, // sin(pi/3)
    x: (y + x / 2) * size
  };
}

//Map objects
var index = 0;
var MapElement = function (element) {
  this.x = element.x;
  this.y = element.y;
  this.key = this.x + ',' + this.y + ',' + index;

  this.ortho = convert(this.x, this.y);

  index += 1;
};





var Tile = function(tile) {
  MapElement.call(this, tile);

  this.resource = tile.resource;

  //vertex
  this.vertex = [];
  this.vertex.push(convert(this.x, this.y - 1));
  this.vertex.push(convert(this.x + 1, this.y - 1));
  this.vertex.push(convert(this.x + 1, this.y));
  this.vertex.push(convert(this.x, this.y + 1));
  this.vertex.push(convert(this.x - 1, this.y + 1));
  this.vertex.push(convert(this.x - 1, this.y));
};
Tile.prototype = Object.create(MapElement.prototype);
Tile.prototype.constructor = Tile;

var City = function(city) {
  MapElement.call(this, city);
};
City.prototype = Object.create(MapElement.prototype);
City.prototype.constructor = City;

var Path = function(path) {
  MapElement.call(this, {x: path.from.x, y: path.from.y});

  this.to = path.to;
  this.to.ortho = convert(this.to.x, this.to.y);

  this.from = path.from;
  this.from.ortho = convert(this.from.x, this.from.y);
};
Path.prototype = Object.create(MapElement.prototype);
Path.prototype.constructor = Path;



module.exports = MapHelpher;