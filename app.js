'use strict';

var express = require('express');
var path = require('path');

var app;
module.exports = app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(request, response) {
	response.send('Hello fellows\n');
});