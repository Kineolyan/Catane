'use strict';

/*
  React component containing the lobby to choose the same
*/

import React from 'react';
import Socket from '../../libs/socket';
import Globals from '../../libs/globals';
import reactBootstrap from 'react-bootstrap';

import Morearty from 'morearty';
import reactMixin from 'react-mixin';
import Immutable from 'immutable';

var Button = reactBootstrap.Button;
var Glyphicon = reactBootstrap.Glyphicon;

export default class Lobby extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Triggered when the component is rendered, initialize the componenent
   */
  componentDidMount() {
    this.initSocket();
    Socket.emit(Globals.socket.gameList);
  }

  /**
   * Render the lobby interface
   * @return {React.Element} the rendered element
   */
  render() {
    var index = 0;
    var binding = this.getDefaultBinding();

    var games = binding.get('games').map((game) => {
        return (<li className={'game-elem'} key={game.id} data-index={index} onClick={this.chooseGame.bind(this)}>
                  Join Game {game.id} <Glyphicon glyph="arrow-right" />
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
    var games = binding.get('games').toArray();
    this.tmpGame = games[event.currentTarget.dataset.index];

    Socket.emit(Globals.socket.gameJoin, this.tmpGame.id);
  }

  /**
   * Init the socket receiver for the game
   */
  initSocket() {

    //game create
    Socket.on(Globals.socket.gameCreate, (response) => {
        this.getDefaultBinding().set('gameChosen', Immutable.fromJS(response.game));
    });

    //list of game
    Socket.on(Globals.socket.gameList, (response) => {
        this.getDefaultBinding().set('games', Immutable.fromJS(response.games));
    });

    //game chosen
    Socket.on(Globals.socket.gameJoin, () => {
        this.getDefaultBinding().set('gameChosen', Immutable.fromJS(this.tmpGame));
    });
  }

  /**
   * When the component is destroyed
   */
  componentWillUnmount() {
    Socket.removeAllListeners(Globals.socket.gameList);
    Socket.removeAllListeners(Globals.socket.gameCreate);
    Socket.removeAllListeners(Globals.socket.gameJoin);
  }
}

Lobby.displayName = 'Lobby';
reactMixin(Lobby.prototype, Morearty.Mixin);
