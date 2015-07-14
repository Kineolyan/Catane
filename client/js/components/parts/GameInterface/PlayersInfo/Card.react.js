'use strict';

/* 
  React component containing the card 
*/

import React from 'react';
import {Group, Text} from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';

export default class Card extends React.Component {

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
        <Text fill="black" y={20} x={this.props.width / 2} alignment="center" font={{'font-size':  '12px'}}>{this.props.type}</Text>
      </Group>
    );
  }
}

Card.propTypes = {
    type: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number
};

Card.defaultProps = {
  x: 0,
  y: 0, 
  width: 40, 
  height: 40
};

Card.displayName = 'Card';