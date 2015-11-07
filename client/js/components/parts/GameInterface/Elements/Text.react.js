
import React from 'react'; // eslint-disable-line no-unused-vars

import { Group, Text } from 'react-art';

/**
 * Text element with default properties
 */
export default class CustomText extends React.Component {

  render() {
    return (<Group x={this.props.x}
                  y={this.props.y - this.props.fontSize * 0.5}>

                <Text fill={this.props.color}
                      alignment={this.props.alignment}
                      font={{ 'font-size': `${this.props.fontSize}px` }}>
                  {this.props.text}
                </Text>
            </Group>);
  }

}

CustomText.propTypes = {
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  color: React.PropTypes.string,
  alignment: React.PropTypes.string,
  text: React.PropTypes.string,
  fontSize: React.PropTypes.number
};

CustomText.defaultProps = {
  x: 0,
  y: 0,
  text: 'Text',
  color: 'black',
  alignment: 'center',
  fontSize: 12
};

CustomText.displayName = 'CustomText';
