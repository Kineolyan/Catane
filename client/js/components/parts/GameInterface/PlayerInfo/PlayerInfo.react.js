'use strict';

/* 
  React component containing the player informations
*/

import React from 'react';
import {Group, Text} from 'react-art';
import Deck from './Deck.react';
import OtherPlayer from './OtherPlayer.react';
import Player from '../../../libs/player';

import Globals from '../../../libs/globals';
import Socket from '../../../libs/socket';
export default class PlayerInfo extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      message: 'Starting...'
    };

    this.id = null;
  }

  componentWillMount() {

    var p = this.props.players;
    var players = p.other.sort((a, b) => a.id - b.id);

    this.id = p.me.id;

    Player.deleteAll();
    players.forEach((element, i) => {
      Player.createPlayer(element.id, element.name, Globals.interface.player.colors[i]);
    });
  }

  componentDidMount() {
    this.initSocket();
  }

  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {

    var index = 0, 
        renderedPlayers = [];

    Player.getMap().forEach((element) => {
      if(element.id !== this.id) {
        renderedPlayers.push(<OtherPlayer key={index}
                                          index={index}
                                          color={element.color}
                                          name={element.name}
                                          width={100}
                                          height={60}
                                          {...element} />);
        index += 1;
      }
    });

    return (
      <Group x={this.props.x} y={this.props.y}>
        <Group y={-30}>
          <Text fill="black" font={{'font-size':  '12px'}}>{this.state.message}</Text>
        </Group>
        <Deck cards={this.state.cards} width={window.innerWidth / 2} height={40} />
        {renderedPlayers}
      </Group>
    );
  }

  initSocket() {

    Socket.on(Globals.socket.playTurnNew, (res) => {
      var playing = Player.getPlayer(res.player);

      if(playing.id === this.id) {
        this.startPlay();
      } else {
        this.setState({message: `Playing : ${playing.name}`});
      }
    });

  }

  startPlay() {
    if(this.props.prepare) {
      this.setState({message: `Choose a colony`});
      this.props.onMyTurn();
    }
  }
}

PlayerInfo.defaultProps = {
    x: 0,
    y: 0,
    players: {other: [], me: {}}
};

PlayerInfo.displayName = 'PlayerInfo';