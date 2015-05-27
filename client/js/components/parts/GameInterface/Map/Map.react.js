'use strict';

/* 
  React component containing the map interface
*/

import React from 'react';
import {Group} from 'react-art';
import MapHelper from '../../../common/map';

import Tile from './Tile.react';
import City from './City.react';
import Path from './Path.react';

import Globals from '../../../libs/globals';
import Players from '../../../common/players';
import MoreartyComponent from '../../MoreartyComponent.react';

export default class MapR extends MoreartyComponent {

  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var board = this.getDefaultBinding().get(),
        tiles = [],
        paths = [],
        cities = [];

    if(board.tiles) {
        board.tiles.forEach((elem) => {
          tiles.push(<Tile key={elem.index} tile={elem} />);
        });
    }
  
    if(board.paths) {
        board.paths.forEach((elem) => {
          paths.push(<Path key={elem.index} path={elem} />);
        });
    }

    if(board.cities) {
        board.cities.forEach((elem) => {
          cities.push(<City key={elem.index} city={elem} />);
        });
    }
    

    return (
      <Group x={this.props.width / 2} y={this.props.height / 2}>
        {tiles}
        {paths}
        {cities}
      </Group>
    );
  }

  

}

MapR.displayName = 'Map';