'use strict';

/*
  Entry point of the interface  
*/

require("gulp-6to5/node_modules/6to5/register");
//declare socket first

var Socket = require('./libs/socket');
var Globals = require('./libs/globals');

var React = require('react');
var GameReact = require('./parts/GameReact'); 

Socket.on(Globals.socket.init, function(data) {
    console.log('game start !');

    React.render(<GameReact init={data}/>, document.getElementById('content'));
});