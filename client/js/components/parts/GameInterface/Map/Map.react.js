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
      selectable: {city: false, path: false, tile: false}
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
          tiles.push(<Tile key={elem.index} tile={elem} selectable={this.state.selectable.tile}/>);
        });
    }
  
    if(board.paths) {
        board.paths.forEach((elem) => {
          paths.push(<Path key={elem.index} path={elem} selectable={this.state.selectable.path && !elem.player} />);
        });
    }

    if(board.cities) {
        board.cities.forEach((elem) => {
          cities.push(<City key={elem.index} city={elem} selectable={this.state.selectable.city && !elem.player} />);
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
    Socket.on(Globals.socket.playPickColony, this.playPickElement.bind(this));
    Socket.on(Globals.socket.playPickPath, this.playPickElement.bind(this));
  }

  playPickElement(res) {
    if(this.props.prepare) {
        var player = Player.getPlayer(res.player);
        var key;
        var payload;

        if(res.colony) {
          key = 'cities';
          payload = res.colony;
          this.setState({selectable: {path: true}});
        } else if(res.path) {
          key = 'paths';
          payload = res.path;
          Socket.emit(Globals.socket.playTurnEnd);
        }

        this._board.giveElement(key, payload, player);
        this.refreshBoard();
    }
  }

  playTurnNew(res) {
    if(this.props.prepare) {
        var player = Player.getPlayer(res.player);
        if(player.isMe()) {
          this.setState({selectable: {city: true}});
        } else {
          this.setState({selectable: {}});
        }
    }
  }
}

MapR.propTypes = {
  board: React.PropTypes.any.isRequired
};

MapR.displayName = 'Map';