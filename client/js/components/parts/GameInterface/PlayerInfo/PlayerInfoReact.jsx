'use strict';

/* 
  React component containing the player informations
*/

var React = require('react');
var Group = require('react-art').Group;
var Deck  = require('./DeckReact');
var OtherPlayer = require('./OtherPlayerReact');
var Globals = require('../../../libs/globals');

var PlayerInfoReact = React.createClass({


   /**
   * Get the initial state of the component
   */
  getInitialState() {
    return {
      cards: []
    };
  },

  getDefaultProps() {
    return {
      x: 0,
      y: 0,
      players: {other: [], me: {}}
    };
  },

  /**
   * Render the whole map of the game
   * @return {React.Element} the rendered element
   */
  render() {
    var p = this.props.players;

    var players = p.other.sort((a, b) => {
                                      return a.id - b.id;
                          }),
        renderedPlayers = [];

    var index = 0;

    players.forEach((element, i) => {
      var id = parseInt(element.id, 10);
      if(id !== p.me.id) {
        renderedPlayers.push(<OtherPlayer key={index}
                                          index={index}
                                          color={Globals.interface.player.colors[i]}
                                          width={100}
                                          height={60}
                                          {...element} />);
        index += 1;
        console.log(index);
      }
    });

    return (
      <Group x={this.props.x} y={this.props.y}>
        <Deck cards={this.state.cards} width={window.innerWidth / 2} height={40} />
        {renderedPlayers}
      </Group>
    );
  }
});

module.exports = PlayerInfoReact;