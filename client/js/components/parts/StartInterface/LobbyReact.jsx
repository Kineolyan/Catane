'use strict';

/*
  React component containing the lobby to choose the same
*/

var React = require('react');
var Socket = require('../../libs/socket');
var Globals = require('../../libs/globals');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

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
    var index = 0;
    var games = this.state.gameAvailables.map((game) => {
        return (<li className={'game-elem'} key={game.id} data-index={index} onClick={this.chooseGame}>
                  Join Game {game.id} <Glyphicon glyph="arrow-right" />
                </li>);
    });

    //no games availables
    if(games.length === 0) {
      games = <div>No games availables. Create one to start !</div>;
    }

    return (
      <div className={'lobby'}>
        <ul className={'list-info'}>
          {games}
        </ul>
        <Button className={'pull-right'} bsSize="small" bsStyle="success" ref="createGameBtn" onClick={this.createGame}>
          Create game <Glyphicon glyph="plus-sign" />
        </Button>

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
    this.tmpGame = this.state.gameAvailables[event.currentTarget.dataset.index];
    Socket.emit(Globals.socket.gameJoin, this.tmpGame.id);
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
        this.props.onGameChosen(this.tmpGame);
    });
  },

  /**
   * When the component is destroyed
   */
  componentWillUnmount() {
    Socket.removeAllListeners(Globals.socket.gameList);
    Socket.removeAllListeners(Globals.socket.gameCreate);
    Socket.removeAllListeners(Globals.socket.gameJoin);
  }
});

module.exports = LobbyReact;