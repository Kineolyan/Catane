'use strict';

/* 
  React component containing the whole game interface
*/

var StartInterface = require('./StartInterface/StartInterfaceReact');
var React = require('react');

var GameReact = React.createClass({

  propTypes: {
    init: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired
    })
  },

   /**
   * Get the initial state of the component
   * @return {Object} Step {Globals.step} game {int}
   */
  getInitialState() {
    return {
      started: false
    };
  },

  /**
   * Start the game
   */

  start() {
    this.setState({started:true});
  },

  /**
   * Render the whole interface of the game
   * @return {React.Element} the rendered element
   */
  render() {

    return (
      <div>
        {this.renderStart()}
      </div>
    );
  },

  /**
   * Render the game to be played
   * @return {React.Element} the rendered element
   */
  renderStart() {
    if(!this.state.started) {
        return (<StartInterface init={this.props.init} onStart={this.start} />);
    }
  }


});

module.exports = GameReact;