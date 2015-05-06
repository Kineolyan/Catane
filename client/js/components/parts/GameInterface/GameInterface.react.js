'use strict';

/* 
  React component containing the game interface
*/

import React from 'react';
import {Surface} from 'react-art';
import MapReact from './Map/Map.react';
import DiceReact from './Dice.react';
import PlayerInfo from './PlayerInfo/PlayerInfo.react';
import Socket from '../../libs/socket';
import Globals from '../../libs/globals';

export default class GameInterface extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      prepare: true
    };

  }

  /**
   * Resize event
   */
  handleResize() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  componentDidMount() {
    this.initSocket();

  }

  /**
   * Render the whole interface of the game
   * @return {React.Element} the rendered element
   */
  render() {

    return (
      <div>
        <Surface x={0} y={0} width={this.state.width} height={this.state.height}>
            <DiceReact x={10} y={10} size={50} />

            <MapReact ref="map" 
                      board={this.props.board} 
                      width={this.state.width} 
                      height={this.state.height} 
                      margin={50}
                      prepare={this.state.prepare}/>
            
            <PlayerInfo ref="player" 
                        players={this.props.players} 
                        prepare={this.state.prepare}
                        onMyTurn={this.changeMap}
                        y={90} 
                        x={20}/>
        </Surface>
      </div>
    );
  }

  initSocket() {
    Socket.on(Globals.socket.gamePrepare, this.launchGame.bind(this));
  }

  launchGame() {
    this.setState({prepare: true});
  }

}

GameInterface.displayName = 'GameInterface';