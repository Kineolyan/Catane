import React from 'react';

export default class Element extends React.Component {

  constructor(props, initState = {}) {
    super(props);

    this.state = Object.assign({mouseIn: false}, initState);
  }

  mouseEnter() {
    this.setState({mouseIn: true});
  }

  mouseLeave() {
    this.setState({mouseIn: false});
  }
}