'use strict';

/* 
  React component containing the whole game interface
*/
var React = require('react');
var Globals = require('../libs/globals');
var Socket = require('../libs/socket');

var RoomReact = React.createClass({

  propTypes: {
    player: React.PropTypes.any.isRequired,
  },

  /**
   * Get the initial state of the component
   * @return {Object} players {Array} 
   */
  getInitialState() {
    return { 
      players: []
      };
  },

  /**
   * Triggered when the component is rendered, initialize the component
   */
  componentDidMount() { 
    this.initSocket();
  },

  /**
   * Render the room interface
   * @return {React.Element} the rendered element
   */
  render() {

    var playersRendered,
        players = this.state.players;

    //include himself if no players in the room 
    if(players.length === 0) {
      players.push({
        id: this.props.player.getId(),
        name: this.props.player.getName()
      });
    }

    playersRendered = players.map((player) => {
      return (<li className={'player-elem'} key={player.id}>{player.name}</li>);
    });

    return (
      <div className={'room'}>
        <div>
          Room #{this.props.game}
        </div>
        <div>
          Players
        </div>
        <ul>
          {playersRendered}
        </ul>
      </div>
    );
  },

  /**
   * Init the socket receiver for the game
   */
  initSocket() {
    Socket.on(Globals.socket.gamePlayers, (response) => {
        this.setState({players: response.players});
    });
  }
});

module.exports = RoomReact;