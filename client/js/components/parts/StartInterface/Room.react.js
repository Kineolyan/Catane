'use strict';

/*
 * React component containing the whole game interface
 */

import reactBootstrap from 'react-bootstrap';

import React from 'react'; // eslint-disable-line no-unused-vars
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

import { startManager } from 'client/js/components/listener/listener';

var Button = reactBootstrap.Button;
var Glyphicon = reactBootstrap.Glyphicon;
var ButtonToolbar = reactBootstrap.ButtonToolbar;

export default class Room extends MoreartyComponent {

  /**
   * Render the room interface
   * @return {Object} the rendered element
   */
  render() {
    var binding = this.getDefaultBinding();
    var players = binding.get('players');
    var startButton;

    // include himself if no players in the room

    var playersRendered = players.map(player => {
      return (<li className={'player-elem'} key={player.get('id')}>
        <Glyphicon glyph="user" /> {player.get('name')}
      </li>);
    }).toArray();

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
    startManager().startGame(binding.get('start.gameChosen.id'));
  }

  /**
   * Leave button
   */
  leave() {
    startManager().quitGame();
  }

}

Room.displayName = 'Room';