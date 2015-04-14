'use strict';

/* 
  React component containing the whole game interface
*/
import React from 'react';
import Globals from '../../libs/globals';
import Socket from '../../libs/socket';
import reactBoostrap from 'react-bootstrap';

var Button = reactBoostrap.Button;
var Glyphicon = reactBoostrap.Glyphicon;

export default class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.initialName
    };
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
        room;
    if(this.props.canChangeName) {
      btn = (<Button bsSize="small" className={'pull-right'} ref="modify" onClick={this.triggerChangeName.bind(this)}>
                Change <Glyphicon glyph="pencil" />
            </Button>);
    }

    if(this.props.game.id) {
      room = <span>/ Room #{this.props.game.id}</span>;
    }

    return (
      <div className={'player clearfix'}>
        <div className={'name pull-left'}>
          {this.state.name} {room}
          
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
   * Get the name
   * @return {String} the name
   */
  getName() {
    return this.state.name;
  }

  /**
   * Get the id
   * @return {Int} the id
   */
  getId() {
    return this.props.id;
  }

  /**
   * Init the socket receiver for the game
   */
  initSocket() {
    Socket.on(Globals.socket.playerNickname, () => {
        this.setState({name: this.tmpName});
        this.props.onChange(Globals.step.chooseLobby);
    });
  }

  /**
   * When the component is destroyed
   */
  componentWillUnmount() {
    Socket.removeAllListeners(Globals.socket.playerNickname);
  }

}

Player.propTypes = {
    initialName: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func,
    canChangeName: React.PropTypes.bool.isRequired
};

Player.defaultProps = {
      game: {}
};

Player.displayName = 'Player';