'use strict';

/* 
  React component containing the game interface
*/

import React from 'react';
import {Surface} from 'react-art';
import MapReact from './Map/Map.react';
import DiceReact from './Dice.react';
import PlayersInfo from './PlayersInfo/PlayersInfo.react';
import Message from './Message.react';

import MoreartyComponent from '../MoreartyComponent.react';

export default class GameInterface extends MoreartyComponent {


  /**
   * Render the whole interface of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var binding = this.getDefaultBinding();

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