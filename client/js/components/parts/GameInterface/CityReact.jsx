'use strict';


/*
  One vertex of a tile
*/
var React = require('react');
var Circle = require('../../../../../node_modules/react-art/shapes/circle');
var Group = require('react-art').Group;

var CityReact = React.createClass({

  getDefaultProps() {
    return {
      radius: 10
    };
  },

  render() {
    var city = this.props.city;
    return (
      <Group x={city.ortho.x} y={city.ortho.y}>
        <Circle radius={this.props.radius} fill="blue"/>
      </Group>
    );
  }
});


module.exports = CityReact;