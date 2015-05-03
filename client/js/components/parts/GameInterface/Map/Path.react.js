'use strict';

/*
  Edge of one tile
*/

import React from 'react';
import Element from './Element.react';
import {Path, Shape} from 'react-art';

export default class PathR extends React.Component {

  render() {
    var p = this.props.path,
        path = new Path(),
        coef;

    if(p.to.ortho.y - p.from.ortho.y) {
      coef = -1 * (p.to.ortho.x - p.from.ortho.x) / (p.to.ortho.y - p.from.ortho.y);
    } else {
      coef = 1;
    }

    var diff = Math.sqrt(Math.pow(this.props.thickness, 2) / (1 + Math.pow(coef, 2)));

    path.moveTo(p.ortho.x - diff, p.ortho.y - diff * coef);
    path.lineTo(p.ortho.x + diff, p.ortho.y + diff * coef);
    path.lineTo(p.to.ortho.x + diff, p.to.ortho.y + diff * coef);
    path.lineTo(p.to.ortho.x - diff, p.to.ortho.y - diff * coef);
    path.close();

    return (
      <Element {...this.props} type={'path'}>
        <Shape d={path} 
               fill="black"
              />
      </Element>
      );
  }
}

PathR.defaultProps = {
  thickness: 3
};

PathR.displayName = 'Path';