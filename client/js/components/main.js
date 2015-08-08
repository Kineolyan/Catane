'use strict';
/* eslint no-console: 0 */

/*
 Entry point of the interface
 */

import 'babel/register';
// declare socket first

import { Socket, Channel } from 'client/js/components/libs/socket';
import Globals from 'client/js/components/libs/globals';
import Listener from 'client/js/components/listener/listener';

import React from 'react';
import * as Contexts from 'client/js/components/libs/context';

import GameReact from 'client/js/components/parts/Game.react';

import socketIO from 'socket.io-client';
var socket = new Socket(socketIO());

socket.on(Channel.init, ({ player: player, server: server, message: message }) => {
	console.log('game start !');

	var context = Contexts.getDefaultContext(player);
	context.game.message = message;
	context.server = server;
	var ctx = Contexts.createContext(context);

	// activate the listener
	Listener.startListen(socket, ctx);

	var Bootstrap = ctx.bootstrap(GameReact);
	React.render(<Bootstrap/>, document.getElementById('content'));
});