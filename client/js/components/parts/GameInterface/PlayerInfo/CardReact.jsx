'use strict';

/* 
  React component containing the card 
*/

var React = require('react');
var Group = require('react-art').Group;
var Text  = require('react-art').Text;
var Rectangle  = require('react-art/shapes/rectangle');

var CardReact = React.createClass({

  propTypes: {
    type: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      x: 0,
      y: 0, 
      width: 40, 
      height: 40
    };
  },
  /**
   * @return {React.Element} the rendered element
   */
  render() {
    return (
      <Group x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height}>
        <Rectangle 
          width={this.props.width}
          height={this.props.height}
          stroke='black'
          fill='white'
        />
        <Text>{this.props.type}</Text>
      </Group>
    );
  }
});

module.exports = CardReact;