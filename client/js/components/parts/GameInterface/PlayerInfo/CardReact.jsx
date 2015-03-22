'use strict';

/* 
  React component containing the card 
*/

var React = require('react');
var Group = require('react-art').Group;
var Text  = require('react-art').Text;

var CardReact = React.createClass({

  propTypes: {
    type: React.PropTypes.string.isRequired
  },

  /**
   * @return {React.Element} the rendered element
   */
  render() {
    return (
      <Group x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height}>
        <Text>{this.props.type}</Text>
      </Group>
    );
  }
});

module.exports = CardReact;