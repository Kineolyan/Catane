'use strict';

/*
  Entry point of the interface  
*/

var React = require('react');
var GameReact = require('./GameReact'); // need to specify the jsx extension

React.render(<GameReact />, document.getElementById('content'));
