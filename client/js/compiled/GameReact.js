'use strict';

var EdgeReact = require('./EdgeReact');
var React = require('react');

var GameReact = React.createClass({displayName: "GameReact",
  render:function() {
    return (
      React.createElement("svg", {height: "500", width: "600", xmlns: "http://www.w3.org/2000/svg"}, 
        React.createElement(EdgeReact, {x1: "10", y1: "10", x2: "50", y2: "50"})
      )
    );
  }
});

module.exports = GameReact;