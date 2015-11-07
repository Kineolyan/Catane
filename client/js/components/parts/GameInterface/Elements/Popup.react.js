
import React from 'react';

import { Group } from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';

/**
 * Popup element with default properties
 */
export default class Popup extends React.Component {

  render() {
    const { x, y, width, height, fill, padding, children } = this.props;
    const group = { x, y, width, height };

    return (<Group { ...group }>
              <Rectangle { ...group } fill={ fill } />
              <Group x={ x + padding }
                    y={ y + padding }
                    width={ width - padding * 2}
                    height={ height - padding * 2}>
                { children }
              </Group>
            </Group>);
  }


}


Popup.displayName = 'Popup';
