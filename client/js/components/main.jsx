'use strict';

/*
  Entry point of the interface  
*/

//declare socket first
var Socket = require('./socket');


var React = require('react');
var GameReact = require('./GameReact'); // need to specify the jsx extension

Socket.on('init', function(data) {
    console.log('game start !');
    React.render(<GameReact init={data}/>, document.getElementById('content'));
});