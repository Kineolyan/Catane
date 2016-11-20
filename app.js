'use strict';

exports.appServer = function() {
	// Sets the paths for absolute requires
	var path = require('path');
	process.env.NODE_PATH = [
		path.join(__dirname, 'build'),
		path.join(__dirname)
	].join(':');
	// Resets the module paths
	require('module').Module._initPaths();

	// Create application
	var Server = require('server/server.js').default;
	Server.TIME_TO_RECONNECT = 15 /* min */ * 60 /* sec */ * 1000;

	// Create environment
	var Socket = require('server/core/com/sockets').default;
	var { idGenerator } = require('server/core/game/util');

	var catane = new Server();

	var express = require('express');
	var app = express();

	/*
	 * Http server definition
	 */
	app.use(express.static(path.join(__dirname, 'build/client')));
	app.get('/', function(request, response) {
		response.sendFile('client/index.html', { root: __dirname });
	});

	/*
	 * Socket connectivity
	 */
	var server = require('http').Server(app);
	var io = require('socket.io')(server);
	var socketId = idGenerator();
	io.on('connection', function(s) {
		var sid = socketId();
		var socket = new Socket(sid, s, io.sockets);
		catane.connect(socket);
	});

	return server;
};