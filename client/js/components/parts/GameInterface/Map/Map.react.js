'use strict';

/* 
  React component containing the map interface
*/

import React from 'react';
import {Group} from 'react-art';
import MapHelper from '../../../libs/map';

import Tile from './Tile.react';
import City from './City.react';
import Path from './Path.react';

import Socket from '../../../libs/socket';
import Globals from '../../../libs/globals';
import Player from '../../../libs/player';

export default class MapR extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      board: new MapHelper(this.props.board, this.props.margin),
      canSelect: false
    };
  }


  componentDidMount() {
    this.initSocket();
  }
  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var board = this.state.board,
        tiles = [],
        paths = [],
        cities = [];

    if(board.tiles) {
        board.tiles.forEach((elem) => {
          tiles.push(<Tile key={elem.key} tile={elem} selectable={this.state.canSelect && !elem.player} />);
        });
    }
  
    if(board.paths) {
        board.paths.forEach((elem) => {
          paths.push(<Path key={elem.key} path={elem} selectable={this.state.canSelect && !elem.player} />);
        });
    }
    if(board.cities) {
        board.cities.forEach((elem) => {
          cities.push(<City key={elem.key} city={elem} selectable={this.state.canSelect && !elem.player} />);
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

  initSocket() {
    Socket.on(Globals.socket.playTurnNew, this.playTurnNew.bind(this));
  }

  playTurnNew(res) {
    if(this.props.prepare) {
        var player = Player.getPlayer(res.player);
        this.setState({canSelect: player.isMe()});
    }
  }
}

MapR.propTypes = {
  board: React.PropTypes.any.isRequired
};

MapR.displayName = 'Map';