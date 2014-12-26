'use strict';

var EdgeReact = require('./EdgeReact');
var React = require('react');

var GameReact = React.createClass({
  render() {
    return (
      <svg height="500" width="600" xmlns="http://www.w3.org/2000/svg">
        <EdgeReact x1="10" y1="10" x2="50" y2="50" />
      </svg>
    );
  }
});

module.exports = GameReact;