'use strict';


/*
  One vertex of a tile
*/
var React = require('react');

var VertexReact = React.createClass({
  render() {
    return (
      <circle cx={this.props.x} cy={this.props.y} r="3" />
    );
  }
});


module.exports = VertexReact;