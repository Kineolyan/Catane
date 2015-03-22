'use strict';

/* 
  React component containing the player informations
*/

var React = require('react');
var Group = require('react-art').Group;
var Deck  = require('./DeckReact');

var PlayerInfoReact = React.createClass({


   /**
   * Get the initial state of the component
   */
  getInitialState() {
    return {
      cards: []
    };
  },

  getDefaultProps() {
    return {
      x: 0,
      y: 0
    };
  },

  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {

    return (
      <Group x={this.props.x} y={this.props.y}>
        <Deck cards={this.state.cards} width={window.innerWidth / 2} height={40} margin={10} />
      </Group>
    );
  }
});

module.exports = PlayerInfoReact;