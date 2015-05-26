'use strict';

/*
  React component containing the whole game interface
*/

import StartInterface from './StartInterface/StartInterface.react';
import GameInterface from './GameInterface/GameInterface.react';
import Reconnect from './reconnect.react.js';
import React from 'react';

export default class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      started: false,
      board: [],
      players: {other: [], me: {}}
    };
  }

  /**
   * Start the game
   */
  start(board, players) {
    this.setState({started:true, board: board, players: players});
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
    if(!this.state.started) {
        return (
          <div>
            <Reconnect init={this.props.init.server} />
            <StartInterface init={this.props.init} onStart={this.start.bind(this)} />
          </div>
        );
    } else {
        return (<GameInterface board={this.state.board} players={this.state.players} />);
    }
  }


}

Game.propTypes = {
  init: React.PropTypes.shape({
    player: {
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired
    },
    server: {
      id: React.PropTypes.number.isRequired,
      sid: React.PropTypes.number.isRequired
    }
  })
};

Game.displayName = 'Game';