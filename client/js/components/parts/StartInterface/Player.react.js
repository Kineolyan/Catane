'use strict';

/* 
  React component containing the whole game interface
*/
import React from 'react';
import Globals from '../../libs/globals';
import Socket from '../../libs/socket';
import reactBoostrap from 'react-bootstrap';

import MoreartyComponent from '../MoreartyComponent.react';

var Button = reactBoostrap.Button;
var Glyphicon = reactBoostrap.Glyphicon;

export default class Player extends MoreartyComponent {

  /**
   * Render the player interface
   * @return {React.Element} the rendered element
   */
  render() {
    var btn, 
        room,
        binding = this.getDefaultBinding(),
        me = binding.get('players').toJS().getMe();

    btn = (<Button bsSize="small" className={'pull-right'} ref="modify" onClick={this.triggerChangeName.bind(this)}>
                Change <Glyphicon glyph="pencil" />
            </Button>);

    if(binding.get('start.gameChosen.id')) {
      room = <span>/ Room #{binding.get('start.gameChosen.id')}</span>;
    }

    return (
      <div className={'player clearfix'}>
        <div className={'name pull-left'}>
          {me.name} {room}
          
        </div>
        {btn}

      </div>
    );
  }

  /**
   * Ask to change the name
   */
  triggerChangeName() {
    var name = window.prompt('What\'s your name ?');

    Socket.emit(Globals.socket.playerNickname, name);
  }

}

Player.displayName = 'Player';
