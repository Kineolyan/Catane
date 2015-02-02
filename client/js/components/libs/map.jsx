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
  this.hexa = {};
  this.ortho = {};

  //get hexa positions
  if(tile.y % 2) {
    this.hexa.x = tile.x * 2 + 1;
    this.hexa.y = (3 * tile.y + 1) / 2 - tile.x;
  } else {
    this.hexa.x = tile.x * 2;
    this.hexa.y = 3 * tile.y / 2 - tile.x + 1;
  }

  //get ortho position
  this.ortho = converter(this.hexa.x, this.hexa.y, unitSize);

  //vertex
  this.vertex = [];
  this.vertex.push(converter(this.hexa.x, this.hexa.y - 1, unitSize));
  this.vertex.push(converter(this.hexa.x + 1, this.hexa.y - 1, unitSize));
  this.vertex.push(converter(this.hexa.x + 1, this.hexa.y, unitSize));
  this.vertex.push(converter(this.hexa.x, this.hexa.y + 1, unitSize));
  this.vertex.push(converter(this.hexa.x - 1, this.hexa.y + 1, unitSize));
  this.vertex.push(converter(this.hexa.x - 1, this.hexa.y, unitSize));

};


//converter to go from hexa to ortho
function converter(x, y, unitSize) {
  return {
    x: x * 0.87 * unitSize, // sin(pi/3)
    y: (y + x / 2) * unitSize
  };
}


module.exports = MapHelpher;