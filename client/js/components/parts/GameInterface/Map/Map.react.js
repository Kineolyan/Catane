'use strict';

/* 
  React component containing the map interface
*/

import React from 'react';
import {Group} from 'react-art';

import Tile from 'client/js/components/parts/GameInterface/Map/Tile.react';
import City from 'client/js/components/parts/GameInterface/Map/City.react';
import Path from 'client/js/components/parts/GameInterface/Map/Path.react';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

export default class MapR extends MoreartyComponent {

  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var board = this.getDefaultBinding().get().toJS().getBoard(),
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