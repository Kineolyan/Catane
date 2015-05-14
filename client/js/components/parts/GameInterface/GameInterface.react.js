'use strict';

/* 
  React component containing the game interface
*/

import React from 'react';
import {Surface} from 'react-art';
import MapReact from './Map/Map.react';
import DiceReact from './Dice.react';
import PlayersInfo from './PlayersInfo/PlayersInfo.react';
import MessageV from './MessageV.react';

import Players from '../../common/players';
import Message from '../../common/message';
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
            <DiceReact x={10} 
                       y={10} 
                       size={50} 
                       ref="dice"/>

            <MapReact ref="map" 
                      board={this.props.board} 
                      width={this.state.width} 
                      height={this.state.height} 
                      margin={50}
                      prepare={this.state.prepare}/>
            
            <MessageV y={120} />
            <PlayersInfo ref="player" 
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
    Socket.on(Globals.socket.gamePrepare, this.prepareGame.bind(this));
    Socket.on(Globals.socket.playTurnNew, this.playNewTurn.bind(this));
    Socket.on(Globals.socket.gamePlay, this.launchGame.bind(this));
  }

  launchGame() {
    this.setState({prepare: false});
  }

  prepareGame() {
    this.setState({prepare: true});
  }

  playNewTurn(res) {
    var playing = Players.getPlayer(res.player);

    if(playing.isMe()) {
      if(this.state.prepare) {
        Message.content = `Choose a colony then a path`;
      } else {
        Message.content = `Roll the dice`;
        this.refs.dice.enable();
      }
    } else {
        Message.content = `Playing : ${playing.name}`;
    }
  }

}

GameInterface.displayName = 'GameInterface';