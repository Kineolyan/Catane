'use strict';

/* 
  React component containing the cards
*/

import React from 'react';
import {Group} from 'react-art';

import Card from 'client/js/components/parts/GameInterface/PlayersInfo/Card.react';

export default class Deck extends React.Component {
  
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
                x={this.props.width * index + index ? this.props.margin : 0} 
                y={0}
                width={width / (deckLength) - this.props.margin}
                height={height} 
                key={index += 1}/>;
    });

    return (
      <Group x={this.props.x} y={this.props.y} width={width} height={height}>
        {cards}
      </Group>
    );
  }
}

Deck.propTypes = {
    cards: React.PropTypes.any.isRequired,
    margin: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number
};

Deck.defaultProps = {
  cards: [],
  margin: 10,
  width: 200,
  height: 40,
  x: 0,
  y: 0
};

Deck.displayName = 'Deck';