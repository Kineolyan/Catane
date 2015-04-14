'use strict';

/* 
  A tile of the map 
*/

import React from 'react';
import {Group, Text} from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';

import Globals from '../../libs/globals';
import Socket from '../../libs/socket';

export default class Dice extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      first: 1,
      second: 1,
      rolling: false
    };
  }

  componentDidMount() {
    this.initSocket();
  }

  result(dice, done) {
    var round = this.props.rolls;
    done = done || function() {};

    this.setState({rolling: true});

    var chg = (time, result) => {
      setTimeout(() => {
        this.setState({
          first: result ? result.first : parseInt(Math.random() * 6 + 1),
          second: result ? result.second : parseInt(Math.random() * 6 + 1),
        });

        round -= 1;
        if(round > 0) {
          chg(parseInt(time * 1.15, 10));
        } else if (round === 0) {
          chg(parseInt(time, 10), dice);
        } else {
          this.setState({rolling: false}, done);
        }

      }, time);
    };

    chg(this.props.startTime);

  }

  launch() {
    if(!this.state.rolling) {
      Socket.emit(Globals.socket.mapDice);
    }
  }

  render() {
    
    var size = this.props.size,
        margin = size + 10,
        color = this.state.rolling ? '#FBF896' : '#D1FFA3';

    return (
      //react art handles event in its own way, see react-art modules - to investigate more
      <Group x={this.props.x} y={this.props.y} onClick={this.launch.bind(null, this)} cursor="pointer">  
        
        <Rectangle width={size} height={size} stroke="black" fill={color} />
        <Text y={size / 4} x={size / 2} fill="black" alignment="center" font={{'font-size': size / 2 + 'px'}}>
          {this.state.first.toString()}
        </Text>

        <Rectangle x={margin} width={size} height={size} stroke="black" fill={color} />
        <Text y={size / 4} x={margin + size / 2} fill="black" alignment="center" font={{'font-size': size / 2 + 'px'}}>
          {this.state.second.toString()}
        </Text>
      </Group>
      );
  }


  initSocket() {
    Socket.on(Globals.socket.mapDice, (data) => {
        this.result(data.dice);
    });
  }
}

Dice.defaultProps = {
    x: 0, 
    y: 0,
    size: 10,
    startTime: 200,
    rolls: 10
};

Dice.displayName = 'Dice';