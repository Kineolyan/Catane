'use strict';

/* 
  React component containing the game interface
*/

var React = require('react');
var Surface = require('react-art').Surface;
//var Shape = require('react-art').Shape;
//var Group = require('react-art').Group;

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
        <Surface width={this.state.width} height={this.state.height}>
          
        </Surface>
      </div>
    );
  }


});

module.exports = GameInterfaceReact;