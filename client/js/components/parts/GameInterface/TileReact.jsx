'use strict';

/* 
  A tile of the map 
*/

var React = require('react');
var Group = require('react-art').Group;
var Shape = require('react-art').Shape;
var Circle = require('react-art/shapes/circle');
var Text = require('react-art').Text;

var TileReact = React.createClass({


  render() {
    var tile = this.props.tile,
        vertex = tile.vertex,
        path = 'M' + vertex[0].x + ' ' + vertex[0].y,
        circleRadius = (tile.unitSize / 3);

    for(var i = 1; i < vertex.length; i += 1) {
        path += ' L ' + vertex[i].x + ' ' + vertex[i].y;
    }

    path += ' L ' + vertex[0].x + ' ' + vertex[0].y;
    

    return (
      <Group x={tile.ortho.x} y={tile.ortho.y}>
        <Shape d={path} 
               fill='#f3f3f3'
               stroke='#FFFFFF'
              />

        <Circle radius={circleRadius} fill="white" stroke="black" />

        <Text ref="value" y={-circleRadius/2} fill="black" alignment="center" font={{'font-size': circleRadius + 'px'}}>
            {tile.diceValue + ''}
        </Text>
      </Group>
      );
  }
});

module.exports = TileReact;