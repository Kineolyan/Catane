'use strict';

/*
  A tile of the map
*/

import React from 'react';
import {Group, Shape, Text} from 'react-art';
import Circle from 'react-art/shapes/circle';

import Globals from '../../libs/globals';

export default class Tile extends React.Component {

  render() {
    var tile = this.props.tile,
        vertex = tile.vertex,
        path = 'M' + vertex[0].x + ' ' + vertex[0].y,
        circleRadius = (tile.unitSize / 3),
        color = this.tileColor();

    for(var i = 1; i < vertex.length; i += 1) {
        path += ' L ' + vertex[i].x + ' ' + vertex[i].y;
    }

    path += ' L ' + vertex[0].x + ' ' + vertex[0].y;

    var diceValue;
    if (tile.diceValue) {
      diceValue =
        (<Group>
          <Circle radius={circleRadius} fill="white" stroke="black" />
          <Text ref="value" y={-circleRadius/2} fill="black" alignment="center" font={{'font-size': circleRadius + 'px'}}>
            { tile.diceValue.toString() }
          </Text>
        </Group>);
    }

    return (
      <Group x={tile.ortho.x} y={tile.ortho.y}>
        <Shape d={path}
               fill={color}
               stroke='#FFFFFF'
              />

        { diceValue }
      </Group>
      );
  }

  tileColor() {
    var color = 'white',
        tmpCol = Globals.map.resources[this.props.tile.resource];

    if(typeof tmpCol !== 'undefined') {
      color = tmpCol;
    }

    return color;
  }
}

Tile.displayName = 'Tile';
