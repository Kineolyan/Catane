'use strict';

/*
  Edge of one tile
*/

import React from 'react';
import Element from './Element.react';
import {Path, Shape} from 'react-art';
import Socket from '../../../libs/socket';
import Globals from '../../../libs/globals';

export default class PathR extends React.Component {

  render() {
    var p = this.props.path,
        path = new Path(),
        coef,
        color = 'black', 
        thickness = this.props.thickness;

    if(p.player) {
      color = p.player.color;
    }

    /**
     * The idea is to draw a rectangle in any direction using path
     */
    //get the direction of the path
    if(p.to.ortho.y - p.from.ortho.y) {
      coef = -1 * (p.to.ortho.x - p.from.ortho.x) / (p.to.ortho.y - p.from.ortho.y);
    } else {
      coef = 1;
      thickness *= 1.5;
    }

    var diff = Math.sqrt(Math.pow(thickness, 2) / (1 + Math.pow(coef, 2)));

    //draw
    path.moveTo(p.ortho.x - diff, p.ortho.y - diff * coef);
    path.lineTo(p.ortho.x + diff, p.ortho.y + diff * coef);
    path.lineTo(p.to.ortho.x + diff, p.to.ortho.y + diff * coef);
    path.lineTo(p.to.ortho.x - diff, p.to.ortho.y - diff * coef);
    path.close();

    return (
      <Element {...this.props} type={'path'} onClick={this.handleClick.bind(this)}>
        <Shape d={path} 
               fill={color}
              />
      </Element>
      );
  }

  handleClick() {
    if(this.props.selectable) {
      Socket.emit(Globals.socket.playPickPath, {path: this.props.path.key});
    }
  }
}

PathR.defaultProps = {
  thickness: 3
};

PathR.displayName = 'Path';