'use strict';

/*
  Entry point of the interface
*/

import 'babel/register';
//declare socket first

import Socket from './libs/socket';
import Globals from './libs/globals';

import React from 'react';
import GameReact from './parts/Game.react';
import Morearty from 'morearty';



Socket.on(Globals.socket.init, (data) => {
    console.log('game start !');

    var ctx = Morearty.createContext({
      initialState: {
        start: {
          init: {
            id: parseInt(data.id, 10),
            name: data.name
          },
          started: false,
          players: {},
          board: [],
          games: [],
          gameChosen: {}
        }
      }
    });

    var Game = ctx.bootstrap(GameReact);

    React.render(<Game />, document.getElementById('content'));
});