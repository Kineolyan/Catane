'use strict';


/*
  One city of the game
*/

import React from 'react';
import Element from './Element.react';
import Circle from 'react-art/shapes/circle';
import {Group} from 'react-art';

export default class City extends Element {

  constructor(props) {
    super(props);
  }

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