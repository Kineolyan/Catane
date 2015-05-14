'use strict';

/* 
  React component containing the player informations
*/

import React from 'react';
import {Group, Text} from 'react-art';

import Message from '../../common/message';

export default class MessageV extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      message: Message.content
    };
  }

  componentWillMount() {
    Message.hasChanged(this.updateText.bind(this));
  }

  updateText(text) {
    this.setState({message: text});
  }
  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {

    return (
      <Group x={this.props.x} y={this.props.y}>
        <Text ref="message" fill="black" font={{'font-size':  '12px'}}>{this.state.message}</Text>
      </Group>
    );
  }
}

MessageV.defaultProps = {
    x: 0,
    y: 0
};

MessageV.displayName = 'Message';