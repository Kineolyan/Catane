'use strict';

var VertexReact = require('./VertexReact');
var React = require('react');

var EdgeReact = React.createClass({displayName: "EdgeReact",
  render:function() {
    return (
      React.createElement("g", null, 
        React.createElement(VertexReact, {x: this.props.x1, y: this.props.y1}), 
        React.createElement("line", {x1: this.props.x1, y1: this.props.y1, 
              x2: this.props.x2, y2: this.props.y2, 
              stroke: "black", 
              "stroke-width": "20"}), 
        React.createElement(VertexReact, {x: this.props.x2, y: this.props.y2})
      )
      );
  }
});


module.exports = EdgeReact;