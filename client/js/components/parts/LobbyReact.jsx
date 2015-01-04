'use strict';

/* 
  React component containing the lobby to choose the same
*/

var React = require('react');
var Socket = require('../libs/socket');
var Globals = require('../libs/globals');

var LobbyReact = React.createClass({

  /**
   * Get the initial state of the component
   * @return {Object} gameAvailables {Array} 
   */
  getInitialState() {
    return {
      gameAvailables: []
    };
  },

  /**
   * Triggered when the component is rendered, initialize the componenent
   */
  componentDidMount() {
    this.initSocket();

    Socket.emit(Globals.socket.gameList);
  },

  /**
   * Render the lobby interface
   * @return {React.Element} the rendered element
   */
  render() {
    var games = this.state.gameAvailables.map((game) => {
      return (<li key={game} data-id={game} onClick={this.choseGame}>{game}</li>);
    });

    return (
      <div>
        <ul>
          {games}
        </ul>
        <button onClick={this.createGame}>Create game</button>
      </div>
    );
  }, 

  /**
   * Ask to create a game
   */
  createGame() {
    Socket.emit(Globals.socket.gameCreate);
  },

  /**
   * Callback when we choose a game
   * @param  {Event} the click event
   */
  choseGame(event) {
    var id = event.currentTarget.dataset.id;
    this.props.onGameChosen(id);
  },

  /**
   * Init the socket receiver for the game
   */
  initSocket() {
    Socket.on(Globals.socket.gameCreate, (response) => {
      if(response.success) {
        this.props.onGameChosen(response.game);
      }
    });

    Socket.on(Globals.socket.gameList, (response) => {
      if(response.success) {
        this.setState({gameAvailables: response.games});
      }
    });
  }
});

module.exports = LobbyReact;