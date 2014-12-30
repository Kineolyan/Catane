'use strict';

exports.appServer = function() {
	var Server = require('./build/server/server');
	console.log(Server);
	var catane = new Server();

	var express = require('express');
	var app = express();

	/*
	 * Http server definition
	 */
	var path = require('path');
	app.use(express.static(path.join(__dirname, 'build/client')));
	app.get('/', function(request, response) {
		response.sendFile('client/index.html', {root: __dirname});
	});
	/*
	 * Socket connectivity
	 */
	var server = require('http').Server(app);
	var io = require('socket.io')(server);
	io.on('connection', function(socket) {
		catane.connect(socket);
		socket.on('disconnect', function() {
			//server.disconnect(socket);
		});
	});

	return server;
};