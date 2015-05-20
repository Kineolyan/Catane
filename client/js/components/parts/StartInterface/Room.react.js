'use strict';

/*
  React component containing the whole game interface
*/
import React from 'react';
import Globals from '../../libs/globals';
import Socket from '../../libs/socket';
import reactBootstrap from 'react-bootstrap';
import Morearty from 'morearty';
import reactMixin from 'react-mixin';
import Immutable from 'immutable';

var Button = reactBootstrap.Button;
var Glyphicon = reactBootstrap.Glyphicon;
var ButtonToolbar = reactBootstrap.ButtonToolbar;

export default class Room extends React.Component {

  constructor(props) {
    super(props);
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
        binding = this.getDefaultBinding(),
        players = binding.get('players'),
        startButton;

    //include himself if no players in the room
    if(players.size === 0) {
      var init = binding.sub('init');
      players.set(init.get('id'), {
        id: init.get('id'),
        name: init.get('name')
      });
    }

    playersRendered = [];
    for (let player of players.values()) {
      playersRendered.push(<li className={'player-elem'} key={player.id}><Glyphicon glyph="user" /> {player.name}</li>);
    }

    if(players.size >= 2) {
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
            Leave Game #{binding.get('gameChosen.id')} <Glyphicon glyph="arrow-left" />
          </Button>
        </ButtonToolbar>
      </div>
    );
  }

  /**
   * Start button
   */
  start() {
    var binding = this.getDefaultBinding();
    Socket.emit(Globals.socket.gameStart, binding.get('gameChosen').id);
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
    var binding = this.getDefaultBinding();
    Socket.on(Globals.socket.gamePlayers, (response) => {
      var players = new Map();
      response.players.forEach((player) => players.set(player.id, player));

      binding.set('players', Immutable.fromJS(players));
    });

    Socket.on(Globals.socket.playerNickname, (response) => {
      var updatedPlayer = response.player;
      var players = this.state.players;
      players.get(updatedPlayer.id).name = updatedPlayer.name;

      binding.set('players', Immutable.fromJS(players));
    });

    //game started
    Socket.on(Globals.socket.gameStart, (response) => {
        var other = this.state.players.filter(e => parseInt(e.id, 10) !== this.props.player.getId());
        binding.atomically()
               .set('board', Immutable.fromJS(response.board))
               .set('playersList', Immutable.fromJS({other: other,
                                            me: {
                                                  id: this.props.player.getId(),
                                                  name: this.props.player.getName()
                                                }
                }))
               .set('started', true)
               .commit();
    });

    //game leave
    Socket.on(Globals.socket.gameQuit, () => {
        binding.set('gameChosen', Immutable.fromJS({}));
    });
  }

  /**
   * When the component is destroyed
   */
  componentWillUnmount() {
    Socket.removeAllListeners(Globals.socket.gamePlayers);
    Socket.removeAllListeners(Globals.socket.playerNickname);
    Socket.removeAllListeners(Globals.socket.gameStart);
    Socket.removeAllListeners(Globals.socket.gameQuit);
  }

}

Room.displayName = 'Room';

reactMixin(Room.prototype, Morearty.Mixin);