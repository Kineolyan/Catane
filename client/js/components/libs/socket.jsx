'use strict';


var socket = require('socket.io-client')();

var sockets = {
  on(event, callback) {
    socket.on(event, (response) => {
        callback(response);
      });
  },
  emit(event, data) {
    return socket.emit(event, data);
  }
};

module.exports = sockets;
