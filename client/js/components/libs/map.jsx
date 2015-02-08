'use strict';


var MapHelpher = function(board) {
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

var unitSize = 60;
var index = 0;
var MapElement = function (element) {
  this.x = element.x;
  this.y = element.y;
  this.key = this.x + ',' + this.y + ',' + index;

  this.ortho = this.convert(this.x, this.y);

  index += 1;
};

MapElement.prototype.convert = function(x, y) {
  return {
    y: x * 0.87 * unitSize, // sin(pi/3)
    x: (y + x / 2) * unitSize
  };
};

var Tile = function(tile) {
  MapElement.call(this, tile);

  this.resource = tile.resource;

  //vertex
  this.vertex = [];
  this.vertex.push(this.convert(this.x, this.y - 1));
  this.vertex.push(this.convert(this.x + 1, this.y - 1));
  this.vertex.push(this.convert(this.x + 1, this.y));
  this.vertex.push(this.convert(this.x, this.y + 1));
  this.vertex.push(this.convert(this.x - 1, this.y + 1));
  this.vertex.push(this.convert(this.x - 1, this.y));
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
  this.to.ortho = this.convert(this.to.x, this.to.y);

  this.from = path.from;
  this.from.ortho = this.convert(this.from.x, this.from.y);
};
Path.prototype = Object.create(MapElement.prototype);
Path.prototype.constructor = Path;



module.exports = MapHelpher;