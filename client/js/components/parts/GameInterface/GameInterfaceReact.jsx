'use strict';

/* 
  React component containing the game interface
*/

var React = require('react');
var Surface = require('react-art').Surface;
var MapReact = require('./MapReact');

var GameInterfaceReact = React.createClass({

  propTypes: {},

   /**
   * Get the initial state of the component
   */
  getInitialState() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  },

  /**
   * Resize event
   */

  handleResize() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  },

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  },

  /**
   * Render the whole interface of the game
   * @return {React.Element} the rendered element
   */
  render() {
    return (
      <div>
        <Surface x={0} y={0} width={this.state.width} height={this.state.height}>
            <MapReact initBoard={this.props.board} width={this.state.width} height={this.state.height} margin={50}/>
        </Surface>
      </div>
    );
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

        

});

module.exports = GameInterfaceReact;