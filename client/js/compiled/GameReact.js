'use strict';

var CaseReact = require('./CaseReact');
var React = require('react');

var GameReact = React.createClass({displayName: "GameReact",
  render:function() {
    return (
      React.createElement("svg", {height: "500", width: "600", xmlns: "http://www.w3.org/2000/svg"}, 
        React.createElement(CaseReact, {startX: "50", startY: "20", size: "50", color: "lightblue"}), 
        React.createElement(CaseReact, {startX: "200", startY: "20", size: "50", color: "lightgreen"})

      )
    );
  }
});

module.exports = GameReact;