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

    React.render(<GameReact init={data}/>, document.getElementById('content'));
});