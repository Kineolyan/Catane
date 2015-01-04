'use strict';

/* 
  React component containing the lobby to choose the same
*/

var React = require('react');
var Socket = require('../libs/socket');
var Globals = require('../libs/globals');

var LobbyReact = React.createClass({



  propTypes: {
    onGameChosen: React.PropTypes.func.isRequired
  },

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
        return (<li key={game.id} data-id={game.id} onClick={this.chooseGame}>{game.id}</li>);
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
  chooseGame(event) {
    console.log(event.currentTarget.dataset.id);
    this.tmpId = parseInt(event.currentTarget.dataset.id, 10);
    Socket.emit(Globals.socket.gameJoin, this.tmpId);
  },

  /**
   * Init the socket receiver for the game
   */
  initSocket() {

    //game create
    Socket.on(Globals.socket.gameCreate, (response) => {
        this.props.onGameChosen(response.game);
    });

    //list of game
    Socket.on(Globals.socket.gameList, (response) => {
        this.setState({gameAvailables: response.games});
    });

    //game chosen
    Socket.on(Globals.socket.gameJoin, () => {
        this.props.onGameChosen(this.tmpId);
    });
  },

  /**
   * When the component is destroyed
   */
  componentWillUnmount() {
    Socket.removeAllListeners(Globals.socket.gameList);
    Socket.removeAllListeners(Globals.socket.gameCreate);
  }
});

module.exports = LobbyReact;