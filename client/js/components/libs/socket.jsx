'use strict';

var socket = require('socket.io-client')();

var sockets = {
  on(event, callback) {
    socket.on(event, (response) => {

        if(response._success === false) {
          window.alert('Error :' + response.message);
        } else {
            callback(response);
        }
      });
  },
  emit(event, data) {
    return socket.emit(event, data);
  },
  removeAllListeners(name) {
    socket.removeAllListeners(name);
  }
};

module.exports = sockets;