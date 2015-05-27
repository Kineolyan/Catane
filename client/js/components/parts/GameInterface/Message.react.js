'use strict';

/* 
  React component containing the player informations
*/

import React from 'react';
import {Group, Text} from 'react-art';

import MoreartyComponent from '../MoreartyComponent.react';

export default class Message extends MoreartyComponent {
  
  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var binding = this.getDefaultBinding();

    return (
      <Group x={this.props.x} y={this.props.y}>
        <Text ref="message" fill="black" font={{'font-size':  '12px'}}>{binding.get()}</Text>
      </Group>
    );
  }
}

Message.defaultProps = {
    x: 0,
    y: 0
};

Message.displayName = 'Message';