'use strict';

/* 
  React component containing the whole game interface
*/

var Player = require('./PlayerReact');
var Lobby = require('./LobbyReact');
var React = require('react');
var Globals = require('../libs/globals');
var Room = require('./RoomReact');

var GameReact = React.createClass({



  propTypes: {
    init: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired
    })
    
  },

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
   * Change the minamal step where the game should be
   * @param  {Globals.step} the minamal step 
   */
  setMinimalStep(step) {
    if(this.state.step <= step) {
      this.setState({step: step});
    }
  },

  /**
   * Start the game with the selected game 
   * @param  {Int} the game id
   */
  chooseGame(game) {
    this.setMinimalStep(Globals.step.inLobby);
    this.setState({game:game});
  },


  /**
   * Render the whole interface of the game
   * @return {React.Element} the rendered element
   */
  render() {
    return (
      <div>
        <Player ref="player" onChange={this.setMinimalStep} initialName={this.props.init.name} 
                id={parseInt(this.props.init.id, 10)} 
                canChangeName={Globals.step.inStep(this.state.step, Globals.step.chooseLobby, Globals.step.init)}/>

        {this.renderChooseLobby()}
        {this.renderInLobby()}

      </div>
    );
  },

  /**
   * Render the lobby to choose and create a game
   * @return {React.Element} the rendered element
   */
  renderChooseLobby() {
    if(Globals.step.inStep(this.state.step, Globals.step.chooseLobby, Globals.step.init)) {
      return (<Lobby onGameChosen={this.chooseGame} />);
    }
  },

   /**
   * Render the inLobby to wait before launching the game
   * @return {React.Element} the rendered element
   */
  renderInLobby() {
    if(Globals.step.inStep(this.state.step, Globals.step.inLobby, Globals.step.chooseLobby)) {
      return (<Room game={this.state.game} player={this.refs.player} />);
    }
  }

});

module.exports = GameReact;