
import React from 'react'; // eslint-disable-line no-unused-vars
import { Group } from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';

import Text from 'client/js/components/parts/GameInterface/Elements/Text.react';

export default class Button extends React.Component {

  // TODO: Calc size auto
  render() {
    return (<Group x={this.props.x}
                  y={this.props.y}
                  onClick={this.props.onClick}
                  onMouseOver={this.mouseOver.bind(this)}
                  onMouseOut={this.mouseOut.bind(this)}>

                <Rectangle  width={this.props.width}
                            height={this.props.height}
                            stroke={this.props.border}
                            fill={this.props.color} />

                <Text text={this.props.label}
                      x={this.props.width / 2}
                      y={this.props.height / 2} />
            </Group>);
  }

  mouseOver() {
    window.document.body.style.cursor = 'pointer';
  }

  mouseOut() {
    window.document.body.style.cursor = 'auto';
  }

}

Button.propTypes = {
  onClick: React.PropTypes.func,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  color: React.PropTypes.string,
  border: React.PropTypes.string,
  label: React.PropTypes.string
};

Button.defaultProps = {
  x: 0,
  y: 0,
  width: 100,
  height: 40,
  color: '#ABC4ED',
  border: 'black',
  label: 'Click'
};

Button.displayName = 'Button';
