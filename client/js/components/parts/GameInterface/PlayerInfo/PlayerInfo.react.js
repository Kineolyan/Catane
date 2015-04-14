'use strict';

/* 
  React component containing the player informations
*/

import React from 'react';
import {Group} from 'react-art';
import Deck from './Deck.react';
import OtherPlayer from './OtherPlayer.react';
import Globals from '../../../libs/globals';

export default class PlayerInfo extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      cards: []
    };
  }

  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var p = this.props.players;

    var players = p.other.sort((a, b) => {
                                      return a.id - b.id;
                          }),
        renderedPlayers = [];

    var index = 0;
    players.forEach((element, i) => {
      var id = parseInt(element.id, 10);
      if(id !== p.me.id) {
        renderedPlayers.push(<OtherPlayer key={index}
                                          index={index}
                                          color={Globals.interface.player.colors[i]}
                                          width={100}
                                          height={60}
                                          {...element} />);
        index += 1;
      }
    });

    return (
      <Group x={this.props.x} y={this.props.y}>
        <Deck cards={this.state.cards} width={window.innerWidth / 2} height={40} />
        {renderedPlayers}
      </Group>
    );
  }
}

PlayerInfo.defaultProps = {
    x: 0,
    y: 0,
    players: {other: [], me: {}}
};

PlayerInfo.displayName = 'PlayerInfo';