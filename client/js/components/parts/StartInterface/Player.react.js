'use strict';

/* 
  React component containing the whole game interface
*/
import React from 'react';
import Globals from '../../libs/globals';
import Socket from '../../libs/socket';
import reactBoostrap from 'react-bootstrap';
import Morearty from 'morearty';
import reactMixin from 'react-mixin';
import Immutable from 'immutable';

var Button = reactBoostrap.Button;
var Glyphicon = reactBoostrap.Glyphicon;

export default class Player extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Triggered when the component is rendered, initialize the componenent
   */
  componentDidMount() { 
    this.initSocket();
  }

  /**
   * Render the player interface
   * @return {React.Element} the rendered element
   */
  render() {
    var btn, 
        room,
        binding = this.getDefaultBinding();

    btn = (<Button bsSize="small" className={'pull-right'} ref="modify" onClick={this.triggerChangeName.bind(this)}>
                Change <Glyphicon glyph="pencil" />
            </Button>);

    if(binding.get('gameChosen').id) {
      room = <span>/ Room #{binding.get('gameChosen.id')}</span>;
    }

    return (
      <div className={'player clearfix'}>
        <div className={'name pull-left'}>
          {binding.get('init.name')} {room}
          
        </div>
        {btn}

      </div>
    );
  }

  /**
   * Ask to change the name
   */
  triggerChangeName() {
    this.tmpName = window.prompt('What\'s your name ?');

    if(this.tmpName) {
      Socket.emit(Globals.socket.playerNickname, this.tmpName);
    }
  }

  /**
   * Init the socket receiver for the game
   */
  initSocket() {
    var binding = this.getDefaultBinding();

    Socket.on(Globals.socket.playerNickname, () => {
        binding.set('name', Immutable.fromJS(this.tmpName));
    });
  }

  /**
   * When the component is destroyed
   */
  componentWillUnmount() {
    Socket.removeAllListeners(Globals.socket.playerNickname);
  }

}

Player.displayName = 'Player';
reactMixin(Player.prototype, Morearty.Mixin);