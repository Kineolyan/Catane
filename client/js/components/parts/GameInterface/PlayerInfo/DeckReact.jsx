'use strict';

/* 
  React component containing the card 
*/

var React = require('react');
var Group = require('react-art').Group;
var Card  = require('./CardReact');

var DeckReact = React.createClass({

  propTypes: {
    cards: React.PropTypes.any.isRequired,
    margin: React.PropTypes.number
  },


  /**

   * @return {React.Element} the rendered element
   */
  render() {
    
    var deckLength = this.props.cards.length,
        index = 0,
        width = this.props.width,
        height = this.props.height;

    var cards = this.props.cards.map(e => {
      return <Card 
                type={e.type} 
                x={this.props.width * index} 
                y={0}
                width={width / deckLength}
                height={height} />;
    });

    return (
      <Group x={this.props.x} y={this.props.y} width={width} height={height}>
        {cards}
      </Group>
    );
  }
});

module.exports = DeckReact;