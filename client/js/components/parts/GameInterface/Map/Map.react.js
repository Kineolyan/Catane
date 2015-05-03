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

    this._board = new MapHelper(this.props.board, this.props.margin);

    this.state = {
      board: this._board,
      selectable: false
    };

  }

  refreshBoard() {
    this.setState({board: this._board});
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
          tiles.push(<Tile key={elem.index} tile={elem} />);
        });
    }
  
    if(board.paths) {
        board.paths.forEach((elem) => {
          paths.push(<Path key={elem.index} path={elem} selectable={this.state.selectable && !elem.player} />);
        });
    }

    if(board.cities) {
        board.cities.forEach((elem) => {
          cities.push(<City key={elem.index} city={elem} selectable={this.state.selectable && !elem.player} />);
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
    Socket.on(Globals.socket.playPickColony, this.playPickColony.bind(this));
  }

  playPickColony(res) {
    if(this.props.prepare) {
        var player = Player.getPlayer(res.player);
        this._board.giveElement('cities', res.colony, player);
        this.refreshBoard();
    }
  }

  playTurnNew(res) {
    if(this.props.prepare) {
        var player = Player.getPlayer(res.player);
        this.setState({selectable: player.isMe()});
    }
  }
}

MapR.propTypes = {
  board: React.PropTypes.any.isRequired
};

MapR.displayName = 'Map';