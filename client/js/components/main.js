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

Socket.on(Globals.socket.init, ({ player: player, server: server, message: message }) => {
	console.log('game start !');

	var myId = player.id;
	// FIXME Players.createPlayer(Players.myId, player.name);
	var players = [
		{ id: myId, name: player.name, me: true }
	];

	var ctx = Morearty.createContext({
		initialState: {
			// state for the start
			start: {
				games: [], // all the available games [{id: 3, id: 6}]
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
				message: message // message displayed for the current status
			},

			// 'I', the first player
			me: {
				id: myId
			},

			// Other players
			players: players, // all player in the game, see common/player.js

			step: Globals.step.init, // current step of the game. See lib/global.js
			server: server // info send by the server for the reconnect
		}
	});


	var Bootstrap = ctx.bootstrap(GameReact);

	// activate the listener
	Listener.startListen(ctx);

	React.render(<Bootstrap/>, document.getElementById('content'));
});