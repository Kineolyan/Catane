'use strict';

/* 
  React component containing the card 
*/

var React = require('react');
var Group = require('react-art').Group;
var Text  = require('react-art').Text;
var Rectangle  = require('react-art/shapes/rectangle');

var OtherPlayerReact = React.createClass({

  propTypes: {
    nbOfCards: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      nbOfCards: 0,
      color: 'yellow'
    };
  },

  /**
   * @return {React.Element} the rendered element
   */
  render() {

    return (
      <Group x={this.props.x} y={this.props.height * this.props.index}>
        <Rectangle 
          width={this.props.width}
          height={this.props.height}
          stroke='black'
          fill={this.props.color}
        />
        <Group x={10} y={10}>
          <Text fill="black" font={{'font-size':  '12px'}}>{this.props.name}</Text>
          <Text y={20} fill="black" font={{'font-size':  '12px'}}>{'Cards : ' + this.props.nbOfCards.toString()}</Text>
        </Group>
      </Group>
    );
  }
});

module.exports = OtherPlayerReact;