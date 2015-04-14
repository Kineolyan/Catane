'use strict';

/* 
  React component containing the game interface
*/

import React from 'react';
import {Surface} from 'react-art';
import MapReact from './Map.react';
import DiceReact from './Dice.react';
import PlayerInfo from './PlayerInfo/PlayerInfo.react';

export default class GameInterface extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };

  }

  /**
   * Resize event
   */
  handleResize() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  componentDidMount() {
    //window.addEventListener('resize', this.handleResize);
  }

  /**
   * Render the whole interface of the game
   * @return {React.Element} the rendered element
   */
  render() {

    return (
      <div>
        <Surface x={0} y={0} width={this.state.width} height={this.state.height}>
            <DiceReact x={10} y={10} size={50} />
            <MapReact ref="map" initBoard={this.props.board} width={this.state.width} height={this.state.height} margin={50}/>
            <PlayerInfo ref="player" players={this.props.players} y={150} x={20}/>
        </Surface>
      </div>
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

}

GameInterface.displayName = 'GameInterface';