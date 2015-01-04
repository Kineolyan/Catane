'use strict';

/* 
  React component containing the whole game interface
*/
var React = require('react');
var Globals = require('../libs/globals');
var Socket = require('../libs/socket');

var PlayerReact = React.createClass({

  /**
   * Get the initial state of the component
   * @return {Object} name {String} 
   */
  getInitialState() {
    return {
      name: this.props.initialName
    };
  },

  /**
   * Triggered when the component is rendered, initialize the componenent
   */
  componentDidMount() { 
    this.initSocket();
    this.triggerChangeName();
  },

  /**
   * Render the player interface
   * @return {React.Element} the rendered element
   */
  render() {
    return (
      <div className={'player'}>
        <div className={'name'}>
          {this.state.name} ({this.props.id}) 
          <button onClick={this.triggerChangeName}>Modifier</button>
        </div>
      </div>
    );
  },

  /**
   * Ask to change the name
   */
  triggerChangeName() {
    this.tmpName = window.prompt('What\'s your name ?');

    if(this.tmpName) {
      Socket.emit(Globals.socket.playerNickname, this.tmpName);
    }
  }, 

  /**
   * Init the socket receiver for the game
   */
  initSocket() {

    Socket.on('player:nickname', (response) => {
      if(response.success) {
        this.setState({name: this.tmpName});
        this.props.onChange(Globals.step.chooseLobby);
      }
    });
  }
});

module.exports = PlayerReact;