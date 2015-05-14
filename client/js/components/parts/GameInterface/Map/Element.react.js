import React from 'react';
import {Group} from 'react-art';

/**
 * Basic element of the map, handling basic mouse interaction
 */
export default class MapElement extends React.Component {

  constructor(props) {
    super(props);

    this.state = {mouseIn: false};
  }

  render() {
    return (<Group {...this.props} onMouseOver={this.mouseEnter.bind(this)} 
                                   onMouseOut={this.mouseLeave.bind(this)} >
              {this.props.children}
            </Group>);
  }

  mouseEnter() {
    if(this.props.selectable) {
      window.document.body.style.cursor = 'pointer';
    }

    this.setState({mouseIn: true});
  }

  mouseLeave() {
    window.document.body.style.cursor = 'auto';
    this.setState({mouseIn: false});
  }
}