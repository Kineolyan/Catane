'use strict';

/*
  Edge of one tile
*/

var React = require('react');
var Group = require('react-art').Group;
var Path = require('react-art').Path;
var Shape = require('react-art').Shape;

var PathReact = React.createClass({

  getDefaultProps() {
    return {
      thickness: 3
    };
  },

  render() {
    var p = this.props.path,
        path = new Path();

    path.moveTo(p.ortho.x, p.ortho.y);
    path.lineTo(p.to.ortho.x, p.to.ortho.y);
    path.close();

    return (
      <Group>
        <Shape d={path} 
               stroke='#000000'
               strokeWidth={this.props.thickness}
              />
        
      </Group>
      );
  }
});


module.exports = PathReact;