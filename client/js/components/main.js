'use strict';

/*
  Entry point of the interface
*/

import 'babel/register';
//declare socket first

import Socket from 'client/js/components/libs/socket';
import Globals from 'client/js/components/libs/globals';
import Listener from 'client/js/components/listener/listener';
import Players from 'client/js/components/common/players';

import React from 'react';
import Morearty from 'morearty';

import GameReact from 'client/js/components/parts/Game.react';

Socket.on(Globals.socket.init, (data) => {
    console.log('game start !');

    Players.deleteAll();
    Players.myId = parseInt(data.player.id, 10);
    Players.createPlayer(Players.myId, data.player.name);

    var ctx = Morearty.createContext({
      initialState: {
        start: {
          games: [],
          gameChosen: {}
        },

        game: {
          board: [],
          dice: {
            enabled: false,
            rolling: false,
            values: [1,1]
          },
          message: data.message
        },

        players: Players,
        step: Globals.step.init,
        server: data.server
      }
    });

		var Bootstrap = ctx.bootstrap(GameReact);

    var listener = new Listener(ctx);
    listener.startListen();

    React.render(<Bootstrap/>, document.getElementById('content'));
});