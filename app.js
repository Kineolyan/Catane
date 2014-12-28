'use strict';

var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'build/client')));
app.get('/', function(request, response) {
	response.sendFile('client/index.html', {root: __dirname});
});

module.exports = app;

