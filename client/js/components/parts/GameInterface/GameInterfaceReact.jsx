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
   * Render the whole interface of the game
   * @return {React.Element} the rendered element
   */
  render() {
    return (
      <div>
        <Surface x={140} y={140} width={this.state.width} height={this.state.height}>
            <MapReact initBoard={this.props.board} />
        </Surface>
      </div>
    );
  }
        

});

module.exports = GameInterfaceReact;