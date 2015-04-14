'use strict';

/* 
  React component containing the map interface
*/

import React from 'react';
import {Group} from 'react-art';
import MapHelper from '../../libs/map';

import Tile from './Tile.react';
import City from './City.react';
import Path from './Path.react';

export default class MapR extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: this.props.initBoard
    };
  }

  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var board = new MapHelper(this.state.board, this.props.margin),
        tiles,
        paths, 
        cities;

    if(board.tiles) {
        tiles = board.tiles.map((elem) => {
          return <Tile key={elem.key} tile={elem} />;
        });
    }
  
    if(board.paths) {
        paths = board.paths.map((elem) => {
          return <Path key={elem.key} path={elem} />;
        });
    }
    
    if(board.cities) {
        cities = board.cities.map((elem) => {
          return <City key={elem.key} city={elem} />;
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

MapR.propTypes = {
  initBoard: React.PropTypes.any.isRequired
};

MapR.displayName = 'Map';