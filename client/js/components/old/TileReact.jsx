'use strict';

/* 
  A tile of the map 
*/

var React = require('react');
var EdgeReact = require('./EdgeReact');

var CaseReact = React.createClass({
  render() {
    var startX = parseInt(this.props.startX, 10),
        startY = parseInt(this.props.startY, 10),
        size = parseInt(this.props.size, 10),
        color = this.props.color,
        height = size * Math.sqrt(3);

    /*
      Draw each edge of the tile and the path so we are able to interact with edge while 
      filling the tile with a color or image
    */

    return (
      <g transform={'rotate(0 ' + (startX + size / 2) + ' ' + (startY + height / 2) + ')' }>

        <path d={'M' + startX + ' ' + startY + 
                ' h ' + size +
                ' L ' + (startX + size * 3 / 2) + ' ' + (startY + height / 2) +
                ' L ' + (startX + size) + ' ' + (startY + height) +
                ' h -' + size +
                ' L ' + (startX - size / 2) + ' ' + (startY + height / 2) +
                ' L ' + startX + ' ' + startY} 
                fill={color}
                stroke='transparent'
                />

        <EdgeReact x1={startX} 
                   y1={startY} 
                   x2={startX + size}
                   y2={startY} />

        <EdgeReact x1={startX + size} 
                   y1={startY} 
                   x2={startX + size * 3 / 2} 
                   y2={startY + height / 2} />
        
        <EdgeReact x1={startX + size * 3 / 2} 
                   y1={startY + height / 2}
                   x2={startX + size} 
                   y2={startY + height} />

        <EdgeReact x1={startX + size} 
                   y1={startY + height}
                   x2={startX}
                   y2={startY + height} />

        <EdgeReact x1={startX}
                   y1={startY + height}
                   x2={startX - size / 2}
                   y2={startY + height / 2} />

        <EdgeReact x1={startX - size / 2}
                   y1={startY + height / 2} 
                   x2={startX} 
                   y2={startY} />        
      </g>
      );
  }
});

module.exports = CaseReact;