'use strict';


/*
  One city of the game
*/

import React from 'react';
import Element from './Element.react';
import Circle from 'react-art/shapes/circle';
import Socket from '../../../libs/socket';
import Globals from '../../../libs/globals';

export default class City extends React.Component {

  render() {
    var city = this.props.city,
        color = 'black';

    if(city.player) {
      color = city.player.color;
    }

    return (
      <Element x={city.ortho.x} y={city.ortho.y} {...this.props} onClick={this.handleClick.bind(this)}>
        <Circle radius={this.props.radius} fill={color}/>
      </Element>
    );
  }

  handleClick() {
    if(this.props.selectable) {
      Socket.emit(Globals.socket.playPickColony, {colony: this.props.city.key});
    }
  }
}

City.defaultProps = {
  radius: 10
};

City.displayName = 'City';