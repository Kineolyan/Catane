'use strict';

/*
  React component containing the game interface
*/

import { Surface } from 'react-art';

import React from 'react'; // eslint-disable-line no-unused-vars
import MapReact from 'client/js/components/parts/GameInterface/Map/Map.react';
import DiceReact from 'client/js/components/parts/GameInterface/Dice.react';
import PlayersInfo from 'client/js/components/parts/GameInterface/PlayersInfo/PlayersInfo.react';
import Message from 'client/js/components/parts/GameInterface/Message.react';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

export default class GameInterface extends MoreartyComponent {


  componentDidMount() {
    window.onresize = () => {
      let binding = this.getDefaultBinding();
      
      binding.set('game.width', window.innerWidth);
      binding.set('game.height', window.innerHeight);
    };
  }
  /**
   * Render the whole interface of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var binding = this.getDefaultBinding();
    var width = binding.get('game.width');
    var height = binding.get('game.height');

    if(binding.get('game.board').toJS().board) {
        return (
                  <Surface x={0} y={0} width={width} height={height}>
                      <DiceReact x={10}
                                 y={10}
                                 size={50}
                                 binding={binding.sub('game.dice')}
                                 ref="dice"
                                 />

                      <MapReact ref="map"
                                binding={binding.sub('game.board')}
                                width={width}
                                height={height}
                                margin={50}
                                />

                      <Message y={120}
                               x={20}
                               binding={binding.sub('game.message')}
                               />

                      <PlayersInfo ref="player"
                                  binding={binding}
                                  y={90}
                                  x={20}
                                  />
                  </Surface>
              );
    } else {
      return false;
    }

  }
}

GameInterface.displayName = 'GameInterface';