'use strict';

/* 
  React component containing the whole game interface
*/

import Player from './Player.react';
import Lobby from './Lobby.react';
import React from 'react';
import Globals from '../../libs/globals';
import Room from './Room.react';
import reactBoostrap from 'react-bootstrap';

var Jumbotron = reactBoostrap.Jumbotron;
var Grid = reactBoostrap.Grid;
var Row = reactBoostrap.Row;
var Col = reactBoostrap.Col;

export default class StartInterface extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      step: Globals.step.init,
      game: {}
    };
  }

  /**
   * Change the minamal step where the game should be
   * @param  {Globals.step} the minamal step 
   */
  setMinimalStep(step) {
    if(this.state.step <= step) {
      this.setState({step: step});
    }
  }

  /**
   * Start the game with the selected game 
   * @param  {Int} the game id
   */
  chooseGame(game) {
    this.setMinimalStep(Globals.step.inLobby);
    this.setState({game: game});
  }


  /**
   * Start the game with the selected game 
  */
  startGame(board, players) {
    this.setMinimalStep(Globals.step.started);
    this.props.onStart(board, players);
  }

 /**
   * Start the game with the selected game 
  */
  leaveRoom() {
    this.setState({step: Globals.step.chooseLobby, game: {}});
  }


  /**
   * Render the interface of the selection of game
   * @return {React.Element} the rendered element
   */
  render() {
    return (
      <div className={'start-interface'}>
        <Grid>
          <Row>
            <Col md={4} mdOffset={4}>
              <Jumbotron>
                <Player ref="player" onChange={this.setMinimalStep.bind(this)} initialName={this.props.init.name} 
                        id={parseInt(this.props.init.id, 10)} 
                        canChangeName={Globals.step.inStep(this.state.step, Globals.step.inLobby, Globals.step.init)}
                        game={this.state.game} />

                {this.renderChooseLobby()}
                {this.renderInLobby()}

              </Jumbotron>

            </Col>
        
          </Row>
        </Grid>

      </div>
    );
  }

  /**
   * Render the lobby to choose and create a game
   * @return {React.Element} the rendered element
   */
  renderChooseLobby() {
    if(Globals.step.inStep(this.state.step, Globals.step.chooseLobby, Globals.step.init)) {
      return (<Lobby onGameChosen={this.chooseGame.bind(this)} />);
    }
  }

   /**
   * Render the inLobby to wait before launching the game
   * @return {React.Element} the rendered element
   */
  renderInLobby() {
    if(Globals.step.inStep(this.state.step, Globals.step.inLobby, Globals.step.inLobby)) {
      return (<Room game={this.state.game} player={this.refs.player} onStart={this.startGame.bind(this)} onLeave={this.leaveRoom.bind(this)}/>);
    }
  }

}

StartInterface.propTypes = {

    init: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired
    }), 

    onStart: React.PropTypes.func.isRequired
    
};

StartInterface.displayName = 'StartInterface';