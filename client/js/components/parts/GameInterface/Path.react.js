'use strict';

/*
  Edge of one tile
*/

import React from 'react';
import {Group, Path, Shape} from 'react-art';

export default class PathR extends React.Component {

  render() {
    var p = this.props.path,
        path = new Path();

    path.moveTo(p.ortho.x, p.ortho.y);
    path.lineTo(p.to.ortho.x, p.to.ortho.y);
    path.close();
    return (
      <Group>
        <Shape d={path} 
               stroke='#000000'
               strokeWidth={this.props.thickness}
              />
        
      </Group>
      );
  }
}

PathR.defaultProps = {
  thickness: 3
};

PathR.displayName = 'Path';