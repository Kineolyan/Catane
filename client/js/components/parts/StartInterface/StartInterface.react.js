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

import Morearty from 'morearty';
import reactMixin from 'react-mixin';


var Jumbotron = reactBoostrap.Jumbotron;
var Grid = reactBoostrap.Grid;
var Row = reactBoostrap.Row;
var Col = reactBoostrap.Col;

export default class StartInterface extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Render the interface of the selection of game
   * @return {React.Element} the rendered element
   */
  render() {
    var binding = this.getDefaultBinding();
               // {this.renderInLobby()}

    return (
      <div className={'start-interface'}>
        <Grid>
          <Row>
            <Col md={4} mdOffset={4}>
              <Jumbotron>
                <Player binding={binding} />

                {this.renderChooseLobby()}

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
    console.log('chooselobby');
    var binding = this.getDefaultBinding();
    if(!binding.get('gameChosen.id')) {
      return (<Lobby binding={binding} />);
    }
  }

   /**
   * Render the inLobby to wait before launching the game
   * @return {React.Element} the rendered element
   */
  renderInLobby() {
    var binding = this.getDefaultBinding();

    if(binding.get('gameChosen.id')) {
      return (<Room binding={binding} />);
    }
  }

}

StartInterface.displayName = 'StartInterface';
reactMixin(StartInterface.prototype, Morearty.Mixin);