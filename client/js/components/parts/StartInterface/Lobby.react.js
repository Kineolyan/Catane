'use strict';

/*
  React component containing the lobby to choose the same
*/

import React from 'react';
import Socket from 'client/js/components/libs/socket';
import Globals from 'client/js/components/libs/globals';
import reactBootstrap from 'react-bootstrap';

import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

var Button = reactBootstrap.Button;
var Glyphicon = reactBootstrap.Glyphicon;

export default class Lobby extends MoreartyComponent {

  /**
   * Triggered when the component is rendered, initialize the componenent
   */
  componentDidMount() {
    Socket.emit(Globals.socket.gameList);
  }

  /**
   * Render the lobby interface
   * @return {React.Element} the rendered element
   */
  render() {
    var index = 0;
    var binding = this.getDefaultBinding();

    var games = binding.get('start.games').map((game) => {
        return (<li className={'game-elem'} key={game.get('id')} data-index={index} onClick={this.chooseGame.bind(this)}>
                  Join Game {game.get('id')} <Glyphicon glyph="arrow-right" />
                </li>);
    }).toArray();

    //no games availables
    if(games.length === 0) {
      games = <div>No games availables. Create one to start !</div>;
    }

    return (
      <div className={'lobby'}>
        <ul className={'list-info'}>
          {games}
        </ul>
        <Button className={'pull-right'} bsSize="small" bsStyle="success" ref="createGameBtn" onClick={this.createGame.bind(this)}>
          Create game <Glyphicon glyph="plus-sign" />
        </Button>

      </div>
    );
  }

  /**
   * Ask to create a game
   */
  createGame() {
    Socket.emit(Globals.socket.gameCreate);
  }

  /**
   * Callback when we choose a game
   * @param  {Event} the click event
   */
  chooseGame(event) {
    var binding = this.getDefaultBinding();
    var games = binding.get('start.games').toJS();
    var game = games[event.currentTarget.dataset.index];

    Socket.emit(Globals.socket.gameJoin, game.id);
  }


}

Lobby.displayName = 'Lobby';
