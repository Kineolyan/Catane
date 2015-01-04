'use strict';

/*
  React component containing the lobby to choose the same
*/

var React = require('react');
var Socket = require('./socket');

var LobbyReact = React.createClass({


  getInitialState() {
    return {
      gameAvailables: []
    };
  },

  componentDidMount() {
    this.initSocket();

    Socket.emit('game:list');
  },

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

  createGame() {
    Socket.emit('game:create');
  },

  choseGame(event) {
    var id = event.currentTarget.dataset.id;
    this.props.onGameChosen(id);
  },

  initSocket() {
    Socket.on('game:create', (response) => {
      console.log(response);
      if(response._success) {
        this.props.onGameChosen(response.game);
      }
    });

    Socket.on('game:list', (response) => {
      if(response._success) {
        this.setState({gameAvailables: response.games});
      }
    });
  }
});

module.exports = LobbyReact;