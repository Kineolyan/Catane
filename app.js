'use strict';

exports.appServer = function() {

	require('traceur/bin/traceur-runtime');
	var $__server__, $__socket__;
	var Server = (
		$__server__ = require("./build/server/server"),
		$__server__ && $__server__.__esModule && $__server__ || {default: $__server__}
	).default;
	var Socket = (
		$__socket__ = require("./build/server/com/sockets"),
		$__socket__ && $__socket__.__esModule && $__socket__ || {default: $__socket__}
	).default;

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
	var socketId = 0;
	io.on('connection', function(s) {
		socketId += 1;
		var sid = socketId;
		var socket = new Socket(sid, s, io.sockets);
		catane.connect(socket);

		socket.on('disconnect', function() {
			catane.disconnect(socket);
		});
	});

	return server;
};