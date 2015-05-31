'use strict';

/*
  Edge of one tile
*/
import Socket from 'client/js/components/libs/socket';
import Globals from 'client/js/components/libs/globals';

import React from 'react';
import {Path, Shape} from 'react-art';

import Element from 'client/js/components/parts/GameInterface/Map/Element.react';

export default class PathR extends React.Component {

  render() {
    var path = this.props.path,
        p = new Path(),
        coef,
        color = 'black', 
        thickness = this.props.thickness;

    if(path.player) {
      color = path.player.color;
    }

    /**
     * The idea is to draw a rectangle in any direction using path
     */
    //get the direction of the path
    if(path.to.ortho.y - path.from.ortho.y) {
      coef = -1 * (path.to.ortho.x - path.from.ortho.x) / (path.to.ortho.y - path.from.ortho.y);
    } else {
      coef = 1;
      thickness *= 1.5;
    }

    var diff = Math.sqrt(Math.pow(thickness, 2) / (1 + Math.pow(coef, 2)));

    //draw
    p.moveTo(path.ortho.x - diff, path.ortho.y - diff * coef);
    p.lineTo(path.ortho.x + diff, path.ortho.y + diff * coef);
    p.lineTo(path.to.ortho.x + diff, path.to.ortho.y + diff * coef);
    p.lineTo(path.to.ortho.x - diff, path.to.ortho.y - diff * coef);
    p.close();

    return (
      <Element {...this.props} onClick={this.handleClick.bind(this)} selectable={path.selectable}>
        <Shape d={p} 
               fill={color}
              />
      </Element>
      );
  }

  handleClick() {

    if(this.props.path.selectable) {
      Socket.emit(Globals.socket.playPickPath, {path: this.props.path.key});
    }
  }
}

PathR.defaultProps = {
  thickness: 3
};

PathR.displayName = 'Path';