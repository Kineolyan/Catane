'use strict';

/* 
  React component containing the whole game interface
*/

var TileReact = require('./TileReact');
var React = require('react');

var GameReact = React.createClass({
  render() {
    return (
      <svg height="500" width="600" xmlns="http://www.w3.org/2000/svg">
        <TileReact startX="50" startY="20" size="50" color="lightblue"/>
        <TileReact startX="200" startY="20" size="50" color="lightgreen"/>

      </svg>
    );
  }
});

module.exports = GameReact;