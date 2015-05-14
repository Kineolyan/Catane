'use strict';

/* 
  React component containing the card 
*/

import React from 'react';
import {Group, Text} from 'react-art';

import Rectangle from 'react-art/shapes/rectangle';

export default class OtherPlayer extends React.Component {

  

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
          <Text ref="name" fill="black" font={{'font-size':  '12px'}}>{this.props.name}</Text>
          <Text ref="cards" y={20} fill="black" font={{'font-size':  '12px'}}>{'Cards : ' + this.props.nbOfCards}</Text>
        </Group>
      </Group>
    );
  }
}

OtherPlayer.propTypes = {
    nbOfCards: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
};

OtherPlayer.defaultProps = {
  nbOfCards: 0,
  color: 'yellow',
  width: 100,
  height: 60
};

OtherPlayer.displayName = 'OtherPlayer';