'use strict';

exports.appServer = function() {
	require('traceur/bin/traceur-runtime');
	var $__server__;
	var Server = (
		$__server__ = require("././build/server/server"),
		$__server__ && $__server__.__esModule && $__server__ || {default: $__server__}
	).default;

	var catane = new Server();

	var express = require('express');
	var app = express();

	/*
	 * Http server definition
	 */
	var path = require('path');
	app.use(express.static(path.join(__dirname, 'public')));

	app.get('/', function(request, response) {
		response.send('Hello fellows\n');
	});

	/*
	 * Socket connectivity
	 */
	var server = require('http').Server(app);
	var io = require('socket.io')(server);
	io.on('connection', function(socket) {
		catane.connect(socket);

		socket.on('disconnect', function() {
			catane.disconnect(socket);
		});
	});

	return server;
};