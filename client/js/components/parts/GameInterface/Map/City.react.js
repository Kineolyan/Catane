'use strict';


/*
  One city of the game
*/
import Socket from 'client/js/components/libs/socket';
import Globals from 'client/js/components/libs/globals';

import React from 'react';
import Circle from 'react-art/shapes/circle';

import Element from 'client/js/components/parts/GameInterface/Map/Element.react';

export default class City extends React.Component {

  render() {
    var city = this.props.city,
        color = 'black';

    if(city.player) {
      color = city.player.color;
    }

    return (
      <Element x={city.ortho.x} y={city.ortho.y} {...this.props} onClick={this.handleClick.bind(this)} selectable={city.selectable}>
        <Circle radius={this.props.radius} fill={color}/>
      </Element>
    );
  }

  handleClick() {
    if(this.props.city.selectable) {
      Socket.emit(Globals.socket.playPickColony, {colony: this.props.city.key});
    }
  }
}

City.defaultProps = {
  radius: 10
};

City.displayName = 'City';