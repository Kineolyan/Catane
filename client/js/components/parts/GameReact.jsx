'use strict';

/* 
  React component containing the whole game interface
*/

var Player = require('./PlayerReact');
var Lobby = require('./LobbyReact');
var React = require('react');
var Globals = require('../libs/globals');

var GameReact = React.createClass({

   /**
   * Get the initial state of the component
   * @return {Object} Step {Globals.step} game {int}
   */
  getInitialState() {
    return {
      step: Globals.step.init,
      game: 0
    };
  },

  /**
   * Get the initial state of the component
   * @param  {String} the new name of the player
   */
   
  setMinimalStep(step) {
    if(this.state.step <= step) {
      this.setState({step: step});
    }
  },

  chooseGame(game) {
    this.setMinimalStep(Globals.step.inLobby);
    this.setState({game:game});
  },

  render() {
    return (
      <div>
        <Player onChange={this.setMinimalStep} initialName={this.props.init.name} 
                id={this.props.init.id} />

        {this.renderChooseLobby()}
      </div>
    );
  },

  renderChooseLobby() {
    if(this.state.step <= Globals.step.inLobby && this.state.step > Globals.step.init) {
      return (<Lobby onGameChosen={this.chooseGame} />);
    }
  }

  
});

module.exports = GameReact;