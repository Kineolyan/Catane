'use strict';

/*
  React component containing the whole game interface
*/
var React = require('react');
var Globals = require('./globals');
var Socket = require('./socket');

var PlayerReact = React.createClass({

  getInitialState() {
    return {
      name: this.props.initialName
    };
  },

  componentDidMount() {
    this.initSocket();
    this.triggerChangeName();
  },

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

  triggerChangeName() {
    this.tmpName = window.prompt('What\'s your name ?');

    if(this.tmpName) {
      Socket.emit('player:nickname', this.tmpName);
    }
  },

  initSocket() {
    Socket.on('player:nickname', (response) => {
      if(response._success) {
        this.setState({name: this.tmpName});
        this.props.onChange(Globals.step.chooseLobby);
      }
    });
  }
});

module.exports = PlayerReact;