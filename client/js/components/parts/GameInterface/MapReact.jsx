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
      board: new MapHelper(this.props.initBoard)
    };
  },


  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var tiles = this.state.board.tiles.map((elem) => {
      return <Tile key={elem.key} tile={elem} />;
    });
    
    var paths = this.state.board.paths.map((elem) => {
      return <Path key={elem.key} path={elem} />;
    });

    var cities = this.state.board.cities.map((elem) => {
      return <City key={elem.key} city={elem} />;
    });

    return (
      <Group x={350} y={180}>
        {tiles}
        {paths}
        {cities}
      </Group>
    );
  }


});

module.exports = MapReact;