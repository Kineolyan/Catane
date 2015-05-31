'use strict';

/*
  React component containing the whole game interface
*/


import Globals from 'client/js/components/libs/globals';

import React from 'react';

import StartInterface from 'client/js/components/parts/StartInterface/StartInterface.react';
import GameInterface from 'client/js/components/parts/GameInterface/GameInterface.react';
import Reconnect from 'client/js/components/parts/Reconnect.react.js';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

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