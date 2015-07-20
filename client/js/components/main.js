'use strict';
/* eslint no-console: 0 */

/*
 Entry point of the interface
 */

import 'babel/register';
// declare socket first

import Socket from 'client/js/components/libs/socket';
import Globals from 'client/js/components/libs/globals';
import Listener from 'client/js/components/listener/listener';
import Players from 'client/js/components/common/players';

import React from 'react';
import Morearty from 'morearty';

import GameReact from 'client/js/components/parts/Game.react';

Socket.on(Globals.socket.init, (data) => {
	console.log('game start !');

	// create 'I', the first player
	Players.deleteAll();
	Players.myId = parseInt(data.player.id, 10);
	Players.createPlayer(Players.myId, data.player.name);

	var ctx = Morearty.createContext({
		initialState: {
			// state for the start
			start: {
				games: [], // all the games availables [{id: 3, id: 6}]
				gameChosen: {} // the game chosen  {id: 2}
			},

			game: {
				board: {}, // the board for the game, see common/map.js
				dice: { // dice
					enabled: false, // can throw
					rolling: false,  // is rolling
					values: [1, 1], // values on the dice
					resources: {} // resources given by the dice
				},
				message: data.message // message displayed for the current status
			},

			players: Players, // all player in the game, see common/player.js
			step: Globals.step.init, // current step of the game. See lib/global.js
			server: data.server, // info send by the server for the reconnect
      render: 0 // quick hack for forcing re render. TODO, reimplement width/height of the game
		}
	});


	var Bootstrap = ctx.bootstrap(GameReact);

	// activate the listener
	Listener.startListen(ctx);

	React.render(<Bootstrap/>, document.getElementById('content'));
});