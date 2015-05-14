'use strict';

/* 
  React component containing all the players informations
*/

import React from 'react';
import {Group, Text} from 'react-art';
import Circle from 'react-art/shapes/circle';

import Deck from './Deck.react';
import OtherPlayer from './OtherPlayer.react';

import Players from '../../../common/players';
import Globals from '../../../libs/globals';

export default class PlayersInfo extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      cards: []
    };

  }

  componentWillMount() {

    var p = this.props.players;
    var players = p.other.slice();

    if(p.me.name) {
      players.push(p.me);
    }

    players = players.sort((a, b) => a.id - b.id);


    Players.deleteAll();
    Players.myId = p.me.id;
    //create all the players in the players bag
    players.forEach((element, i) => {
      Players.createPlayer(element.id, element.name, Globals.interface.player.colors[i]);
    });


  }

  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {

    var index = 0, 
        renderedPlayers = [],
        color = 'white',
        me = Players.getMe(),
        name = '';

    if(me) {
      color = me.color;
      name = me.name;
    }

    Players.getMap().forEach((element) => {
      if(!element.isMe()) {
        renderedPlayers.push(<OtherPlayer key={index}
                                          index={index}
                                          color={element.color}
                                          name={element.name}
                                          {...element} />);
        index += 1;
      }
    });

    return (
      <Group x={this.props.x} y={this.props.y}>
        <Circle radius={10} fill={color} stroke="black" />
        
        <Text ref="name" y={-5} x={15} fill="black" font={{'font-size':  '12px'}}>{name}</Text>
        
        <Deck cards={this.state.cards} width={window.innerWidth / 2} height={40} />

        <Group y={60}>
          {renderedPlayers}
        </Group>
      </Group>
    );
  }
}

PlayersInfo.defaultProps = {
    x: 0,
    y: 0,
    players: {other: [], me: {}}
};

PlayersInfo.displayName = 'PlayersInfo';