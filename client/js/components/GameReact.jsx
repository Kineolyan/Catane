'use strict';

/* 
  React component containing the whole game interface
*/

var Tile = require('./TileReact');
var Player = require('./PlayerReact');
var React = require('react');

var GameReact = React.createClass({
  render() {
    return (
      <div>
        <Player />
        <svg height="500" width="600" xmlns="http://www.w3.org/2000/svg">
          <Tile startX="30" startY="20" size="50" color="lightblue" />
          <Tile startX="160" startY="20" size="50" color="lightgreen" />
        </svg>
      </div>
    );
  }
});

module.exports = GameReact;