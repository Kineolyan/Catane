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
import Listener from './listener/listener';
import Players from './common/players';

Socket.on(Globals.socket.init, (data) => {
    console.log('game start !');

    Players.myId = parseInt(data.id, 10);
    Players.createPlayer(Players.myId, data.name);

    var ctx = Morearty.createContext({
      initialState: {
        start: {
          games: [],
          gameChosen: {},
        },
        board: [],
        players: Players,
        step: Globals.step.init
      }
    });

    var Game = ctx.bootstrap(GameReact);

    var listener = new Listener(ctx);
    listener.startListen();

    React.render(<Game />, document.getElementById('content'));
});