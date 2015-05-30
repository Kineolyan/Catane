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
import MoreartyComponent from '../../MoreartyComponent.react';

export default class PlayersInfo extends MoreartyComponent {

  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {

    var binding = this.getDefaultBinding();
    var players = binding.get('players').toJS();
    var index = 0, 
        renderedPlayers = [],
        color = 'white',
        me = players.getMe(),
        name = '';

    if(me) {
      color = me.color;
      name = me.name;
    }

    players.getMap().forEach((element) => {
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
        
        <Deck cards={me.cards} width={window.innerWidth / 2} height={40} />

        <Group y={60}>
          {renderedPlayers}
        </Group>
      </Group>
    );
  }
}

PlayersInfo.defaultProps = {
    x: 0,
    y: 0
};

PlayersInfo.displayName = 'PlayersInfo';