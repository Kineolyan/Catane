'use strict';

/* 
  React component containing the map interface
*/

var React = require('react');
var Group = require('react-art').Group;
var MapHelper = require('../../libs/map');
var Tile = require('./TileReact');

var MapReact = React.createClass({

  propTypes: {
    initBoard: React.PropTypes.any.isRequired
  },

   /**
   * Get the initial state of the component
   */
  getInitialState() {
    return {
      board: new MapHelper(this.props.initBoard, 60)
    };
  },


  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var tiles = this.state.board.tiles.map((elem) => {
      return <Tile key={elem.x + ',' + elem.y} tile={elem} />;
    });

    return (
      <Group x={350} y={180}>
        {tiles}
      </Group>
    );
  }


});

module.exports = MapReact;