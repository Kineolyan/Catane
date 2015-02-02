'use strict';

/* 
  A tile of the map 
*/

var React = require('react');
var Group = require('react-art').Group;
var Shape = require('react-art').Shape;

var TileReact = React.createClass({


  render() {
    var vertex = this.props.tile.vertex,
        path = 'M' + vertex[0].x + ' ' + vertex[0].y;

    for(var i = 1; i < vertex.length; i += 1) {
        path += ' L ' + vertex[i].x + ' ' + vertex[i].y;
    }

    path += ' L ' + vertex[0].x + ' ' + vertex[0].y;

    return (
      <Group>

        <Shape d={path} 
               fill='#f3f3f3'
               stroke='#FFFFFF'
              />
        
      </Group>
      );
  }
});

module.exports = TileReact;