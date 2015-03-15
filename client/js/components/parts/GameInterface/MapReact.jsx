'use strict';

/* 
  React component containing the map interface
*/

var React = require('react');
var Group = require('react-art').Group;
var MapHelper = require('../../libs/map');

var Tile = require('./TileReact');
var City = require('./CityReact');
var Path = require('./PathReact');

var MapReact = React.createClass({

  propTypes: {
    initBoard: React.PropTypes.any.isRequired
  },

   /**
   * Get the initial state of the component
   */
  getInitialState() {
    return {
      board: this.props.initBoard
    };
  },


  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var board = new MapHelper(this.state.board, this.props.margin),
        tiles,
        paths, 
        cities;

    if(board.tiles) {
        tiles = board.tiles.map((elem) => {
          return <Tile key={elem.key} tile={elem} />;
        });
    }
  
    if(board.paths) {
        paths = board.paths.map((elem) => {
          return <Path key={elem.key} path={elem} />;
        });
    }
    
    if(board.cities) {
        cities = board.cities.map((elem) => {
          return <City key={elem.key} city={elem} />;
        });
    }
    

    return (
      <Group x={this.props.width / 2} y={this.props.height / 2}>
        {tiles}
        {paths}
        {cities}
      </Group>
    );
  }
});

module.exports = MapReact;