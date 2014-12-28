'use strict';

var React = require('react');
var GameReact = require('./GameReact'); // need to specify the jsx extension

React.render(React.createElement(GameReact, null), document.getElementById('content'));
