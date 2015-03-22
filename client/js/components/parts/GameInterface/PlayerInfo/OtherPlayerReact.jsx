'use strict';

/* 
  React component containing the card 
*/

var React = require('react');
var Group = require('react-art').Group;
var Text  = require('./Text');

var OtherPlayerReact = React.createClass({

  propTypes: {
    nbOfCards: React.PropTypes.number.isRequired
  },

  /**
   * @return {React.Element} the rendered element
   */
  render() {
    return (
      <Group x={this.props.x} y={this.props.y}>
        <Text>{this.props.nbOfCards.toString()}</Text>
      </Group>
    );
  }
});

module.exports = OtherPlayerReact;