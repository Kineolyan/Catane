'use strict';


/*
  One city of the game
*/
var React = require('react');
var Circle = require('react-art/shapes/circle');
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