'use strict';

/*
  React component containing the whole game interface
*/

import StartInterface from './StartInterface/StartInterface.react';
import GameInterface from './GameInterface/GameInterface.react';
import Reconnect from './Reconnect.react.js';
import React from 'react';
import Globals from '../libs/globals';

import MoreartyComponent from './MoreartyComponent.react';

export default class Game extends MoreartyComponent {

  /**
   * Render the whole interface of the game
   * @return {React.Element} the rendered element
   */
  render() {
    return (
      <div>
        {this.renderStart()}
      </div>
    );
  }

  /**
   * Render the game to be played
   * @return {React.Element} the rendered element
   */
  renderStart() {
    var binding = this.getDefaultBinding();
    if(binding.get('step') === Globals.step.init) {
        return (
          <div>
            <Reconnect init={binding.get('server').toJS()} />
            <StartInterface binding={binding} />;
          </div>
        );
    } else {
        return (<GameInterface binding={binding} />);
    }
  }
}

Game.displayName = 'Game';