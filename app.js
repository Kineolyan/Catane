'use strict';

exports.appServer = function() {
	// Requiring this polyfill to have a fully ES6 environment (Map, Symbol, ...)
	require("gulp-6to5/node_modules/6to5/register");

	// Create environment
	var logging = require('./build/server/util/log/logger');
	global.logger = logging.createLogger();

	// Create application
	var Server = require("./build/server/server");
	var Socket = require("./build/server/com/sockets");
	var cUtil = require("./build/server/game/util");
	var idGenerator = cUtil.idGenerator;

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
	var socketId = idGenerator();
	io.on('connection', function(s) {
		var sid = socketId();
		var socket = new Socket(sid, s, io.sockets);
		catane.connect(socket);

		socket.on('disconnect', function() {
			catane.disconnect(socket);
		});
	});

	return server;
};