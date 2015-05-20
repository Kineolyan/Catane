'use strict';

/* 
  React component containing the whole game interface
*/

import StartInterface from './StartInterface/StartInterface.react';
import GameInterface from './GameInterface/GameInterface.react';
import React from 'react';
import Morearty from 'morearty';
import reactMixin from 'react-mixin';

export default class Game extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

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

    if(!binding.get('started')) {
        return (<StartInterface binding={binding.sub('start')} />);
    } else {
        return (<GameInterface binding={binding} />);
    }
  }
}

Game.contextTypes = {
  morearty: React.PropTypes.any
}
Game.displayName = 'Game';
reactMixin(Game.prototype, Morearty.Mixin);