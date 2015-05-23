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

Socket.on(Globals.socket.init, (data) => {
    console.log('game start !');

    var session = JSON.parse(localStorage.server || '{}');
    if (session.id === data.server.id) {
    	// Previously connected to the server
    	var reconnect = window.confirm('Restore the previous game ?');
    	if (reconnect) {
    		Socket.emit('reconnect', session.sid);
    	} else {
    		// Replace the previous info with the new one
    		localStorage.server = JSON.stringify(data.server);
    	}
    } else {
    	// Never connected to the server or to a previous version
    	localStorage.server = JSON.stringify(data.server);
    }

    React.render(<GameReact init={data}/>, document.getElementById('content'));
});