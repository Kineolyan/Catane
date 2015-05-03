'use strict';


/*
  One city of the game
*/
import React from 'react';
import Circle from 'react-art/shapes/circle';
import {Group} from 'react-art';

export default class City extends React.Component {

  render() {
    var city = this.props.city;
    return (
      <Group x={city.ortho.x} y={city.ortho.y}>
        <Circle radius={this.props.radius} fill="black"/>
      </Group>
    );
  }
}

City.defaultProps = {
  radius: 10
};

City.displayName = 'City';