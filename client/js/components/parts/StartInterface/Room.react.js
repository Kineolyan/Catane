'use strict';

/* 
  React component containing the whole game interface
*/
import React from 'react';
import Globals from '../../libs/globals';
import Socket from '../../libs/socket';
import reactBootstrap from 'react-bootstrap';

var Button = reactBootstrap.Button;
var Glyphicon = reactBootstrap.Glyphicon;
var ButtonToolbar = reactBootstrap.ButtonToolbar;

export default class Room extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      players: []
    };
  }

  /**
   * Triggered when the component is rendered, initialize the component
   */
  componentDidMount() { 
    this.initSocket();
  }

  /**
   * Render the room interface
   * @return {React.Element} the rendered element
   */
  render() {

    var playersRendered,
        players = this.state.players,
        startButton;

    //include himself if no players in the room 
    if(players.length === 0) {
      players.push({
        id: this.props.player.getId(),
        name: this.props.player.getName()
      });
    }

    playersRendered = players.map((player) => {
      return (<li className={'player-elem'} key={player.id}><Glyphicon glyph="user" /> {player.name}</li>);
    });

    if(players.length >= 2) {
      startButton = (<Button bsSize={'small'} className={'pull-right'} bsStyle={'success'} ref="startButton" onClick={this.start.bind(this)}>
                        Start <Glyphicon glyph="arrow-right" />
                     </Button>);

    } else {
      playersRendered.push(<li key={'waiting'}>Waiting for more players...</li>);
    }

    return (
      <div className={'room'}>
        
        <ul className={'list-info'}>
          {playersRendered}
        </ul>

        <ButtonToolbar className={'pull-right'}>
          {startButton}
          <Button bsSize="small" className={'pull-right'} bsStyle="info" ref="leaveButton" onClick={this.leave.bind(this)}>
            Leave Game #{this.props.game.id} <Glyphicon glyph="arrow-left" />
          </Button>
        </ButtonToolbar>
      </div>
    );
  }

  /**
   * Start button
   */
  start() {
    Socket.emit(Globals.socket.gameStart, this.props.game.id);
  }

  /**
   * Leave button
   */
  leave() {
    Socket.emit(Globals.socket.gameQuit);
  }

  /**
   * Init the socket receiver for the game
   */
  initSocket() {
    //list of players
    Socket.on(Globals.socket.gamePlayers, (response) => {
        this.setState({players: response.players});
    });

    //game started
    Socket.on(Globals.socket.gameStart, (response) => {
        var other = this.state.players.filter(e => parseInt(e.id, 10) !== this.props.player.getId());
        this.props.onStart(response.board, {other: other, 
                                            me: {
                                                  id: this.props.player.getId(),
                                                  name: this.props.player.getName()
                                                }
                                            });
    });

    //game leave
    Socket.on(Globals.socket.gameQuit, () => {
        this.props.onLeave();
    });
  }

  /**
   * When the component is destroyed
   */
  componentWillUnmount() {
    Socket.removeAllListeners(Globals.socket.gamePlayers);
    Socket.removeAllListeners(Globals.socket.gameStart);
    Socket.removeAllListeners(Globals.socket.gameQuit);
  }

}

Room.propTypes = {
    player: React.PropTypes.any.isRequired,
    game: React.PropTypes.any.isRequired,
    onStart: React.PropTypes.func,
    onLeave: React.PropTypes.func

};

Room.displayName = 'Room';