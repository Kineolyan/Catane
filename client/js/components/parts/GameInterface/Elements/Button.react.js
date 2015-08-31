
import React from 'react'; // eslint-disable-line no-unused-vars
import { Group } from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';

import Text from 'client/js/components/parts/GameInterface/Elements/Text.react';

export default class Button extends React.Component {


  render() {
    const { x, y, onClick, minWidth, height, border, color, label, fontSize, margin } = this.props;
    let ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${fontSize}px`;

    const width = Math.max(ctx.measureText(label).width, minWidth) + margin * 2;

    return (<Group x={x}
                  y={y}
                  onClick={onClick}
                  onMouseOver={this.mouseOver.bind(this)}
                  onMouseOut={this.mouseOut.bind(this)}>

                <Rectangle  width={width}
                            height={height}
                            stroke={border}
                            fill={color} />

                <Text text={label}
                      x={width / 2}
                      y={height / 2}
                      fontSize={fontSize} />
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
  minWidth: React.PropTypes.number,
  height: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  color: React.PropTypes.string,
  border: React.PropTypes.string,
  label: React.PropTypes.string,
  fontSize: React.PropTypes.number,
  margin: React.PropTypes.number
};

Button.defaultProps = {
  x: 0,
  y: 0,
  minWidth: 40,
  height: 40,
  color: '#ABC4ED',
  border: 'black',
  label: 'Click',
  fontSize: 12,
  margin: 10
};

Button.displayName = 'Button';
