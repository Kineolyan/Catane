'use strict';

var React = require('react');

var VertexReact = React.createClass({
  render() {
    return (
      <circle cx={this.props.x} cy={this.props.y} r="2" />
    );
  }
});


module.exports = VertexReact;