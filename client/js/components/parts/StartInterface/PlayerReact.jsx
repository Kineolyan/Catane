'use strict';

/* 
  React component containing the whole game interface
*/
var React = require('react');
var Globals = require('../../libs/globals');
var Socket = require('../../libs/socket');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var PlayerReact = React.createClass({

  propTypes: {
    initialName: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func,
    canChangeName: React.PropTypes.bool.isRequired
  },

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
  },

  /**
   * Render the player interface
   * @return {React.Element} the rendered element
   */
  render() {
    var btn, 
        room;
    if(this.props.canChangeName) {
      btn = (<Button bsSize="small" className={'pull-right'} ref="modify" onClick={this.triggerChangeName}>
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
   * Get the name
   * @return {String} the name
   */
  getName() {
    return this.state.name;
  },

  /**
   * Get the id
   * @return {Int} the id
   */
  getId() {
    return this.props.id;
  },

  /**
   * Init the socket receiver for the game
   */
  initSocket() {
    Socket.on(Globals.socket.playerNickname, () => {
        this.setState({name: this.tmpName});
        this.props.onChange(Globals.step.chooseLobby);
    });
  },

  /**
   * When the component is destroyed
   */
  componentWillUnmount() {
    Socket.removeAllListeners(Globals.socket.playerNickname);
  }

});

module.exports = PlayerReact;