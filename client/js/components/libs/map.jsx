'use strict';


var MapHelpher = function(board, unitSize) {
  this.tiles = [];

  if(board.tiles) {
    for(var i = 0; i < board.tiles.length; i += 1) {
        this.tiles.push(new Tile(board.tiles[i], unitSize));    
    }
  }

};

var Tile = function(tile, unitSize) {
  this.x = tile.x;
  this.y = tile.y;
  this.resource = tile.resource;
  this.ortho = {};

  //get ortho position
  this.ortho = converter(this.x, this.y, unitSize);

  //vertex
  this.vertex = [];
  this.vertex.push(converter(this.x, this.y - 1, unitSize));
  this.vertex.push(converter(this.x + 1, this.y - 1, unitSize));
  this.vertex.push(converter(this.x + 1, this.y, unitSize));
  this.vertex.push(converter(this.x, this.y + 1, unitSize));
  this.vertex.push(converter(this.x - 1, this.y + 1, unitSize));
  this.vertex.push(converter(this.x - 1, this.y, unitSize));

};


//converter to go from hexa to ortho
function converter(x, y, unitSize) {
  return {
    y: x * 0.87 * unitSize, // sin(pi/3)
    x: (y + x / 2) * unitSize
  };
}


module.exports = MapHelpher;