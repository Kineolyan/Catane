'use strict';

exports.appServer = function() {
	// Sets the paths for absolute requires
	var path = require('path');
	process.env.NODE_PATH = path.join(__dirname, 'build');
	// Resets the module paths
	require('module').Module._initPaths();

	// Requiring this polyfill to have a fully ES6 environment (Map, Symbol, ...)
	require('babel/register');

	// Create environment
	var logging = require('libs/log/logger');
	global.logger = logging.createLogger(logging.Level.ALL);
	global.TIME_TO_RECONNECT = 15 /* min */ * 60 /* sec */ * 1000;

	// Create application
	var Server = require('server/server');
	var Socket = require('server/core/com/sockets');
	var cUtil = require('server/core/game/util');
	var idGenerator = cUtil.idGenerator;

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