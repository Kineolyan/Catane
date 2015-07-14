'use strict';

/* 
  The dices 
  TODO: Make a x dice
*/
import Globals from 'client/js/components/libs/globals';
import Socket from 'client/js/components/libs/socket';
import Listener from 'client/js/components/listener/listener';

import React from 'react';
import {Group, Text} from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';
import Immutable from 'immutable';

import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';

export default class Dice extends MoreartyComponent {

  componentDidMount() {
    var binding = this.getDefaultBinding();
    this.addBindingListener(binding, 'rolling', () => {
      if(binding.get('rolling')) {
        this.result();
      }
    });
  }
  /**
   * Make the dice rolling
   */
  result() {
    var round = this.props.rolls;
    var binding = this.getDefaultBinding();
    var initValues = binding.get('values').toJS();
    var chg = (time, result) => {
      setTimeout(() => {

        var values = [result ? result[0] : parseInt(Math.random() * 6 + 1),
                      result ? result[1] : parseInt(Math.random() * 6 + 1)];

        binding.set('values', Immutable.fromJS(values));
        round -= 1;
        if(round > 0) {
          chg(parseInt(time * 1.15, 10));
        } else if (round === 0) {
          chg(parseInt(time, 10), initValues);
        } else {
          binding.set('rolling', false);
          Listener.gameManager.giveCards(binding.get('resources').toJS());
        }

      }, time);
    };

    chg(this.props.startTime);

  }

  /**
   * Launch the dice
   */
  launch() {
    var binding = this.getDefaultBinding();
    if(!binding.get('rolling') && binding.get('enabled')) {
      binding.set('enabled', false);
      Socket.emit(Globals.socket.mapDice);
    }
  }

  render() {
    var binding = this.getDefaultBinding();
    var size = this.props.size,
        margin = size + 10,
        color = binding.get('rolling') ? '#FBF896' : '#D1FFA3',
        cursor = binding.get('enabled') ? 'pointer' : 'auto';

    var dices = binding.get('values').map((elem, index) => {

      return (<Group key={index}>
                <Rectangle x={margin * index} width={size} height={size} stroke="black" fill={color} />
                <Text y={size / 4} x={margin * index + size / 2} fill="black" alignment="center" font={{'font-size': size / 2 + 'px'}}>
                  {elem.toString()}
                </Text>
              </Group>);
    }).toArray();

    return (
      <Group x={this.props.x} y={this.props.y} onClick={this.launch.bind(this)} cursor={cursor}>  
        
        {dices}
        
      </Group>
      );
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