'use strict';

/*
  Entry point of the interface  
*/

//declare socket first
var socket = require('./socket');
socket = socket.init();

var React = require('react');
var GameReact = require('./GameReact'); // need to specify the jsx extension

socket.on('std', function() {
    console.log('game start !');
    React.render(<GameReact />, document.getElementById('content'));
});
