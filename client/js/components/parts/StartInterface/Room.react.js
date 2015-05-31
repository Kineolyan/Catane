'use strict';

/*
  React component containing the whole game interface
*/

import Globals from 'client/js/components/libs/globals';
import Socket from 'client/js/components/libs/socket';
import reactBootstrap from 'react-bootstrap';
import React from 'react';

import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

var Button = reactBootstrap.Button;
var Glyphicon = reactBootstrap.Glyphicon;
var ButtonToolbar = reactBootstrap.ButtonToolbar;

export default class Room extends MoreartyComponent {

  /**
   * Render the room interface
   * @return {React.Element} the rendered element
   */
  render() {

    var playersRendered,
        binding = this.getDefaultBinding(),
        players = binding.get('players').toJS().getMap(),
        startButton;

    //include himself if no players in the room

    playersRendered = [];
    for (let player of players.values()) {
      playersRendered.push(<li className={'player-elem'} key={player.id}><Glyphicon glyph="user" /> {player.name}</li>);
    }

    if(players.size >= 2) {
      startButton = (<Button bsSize={'small'} className={'pull-right start'} bsStyle={'success'} ref="startButton" onClick={this.start.bind(this)}>
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
            Leave Game #{binding.get('start.gameChosen.id')} <Glyphicon glyph="arrow-left" />
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
    Socket.emit(Globals.socket.gameStart, binding.get('start.gameChosen.id'));
  }

  /**
   * Leave button
   */
  leave() {
    Socket.emit(Globals.socket.gameQuit);
  }

}

Room.displayName = 'Room';