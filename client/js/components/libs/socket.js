'use strict';

import sock from 'socket.io-client';
var socket = sock();

var sockets = {
  on(event, callback) {
    socket.on(event, (response) => {
        console.log('Response: ', event, response);

        if(response && response._success === false) {
          window.alert('Error :' + response.message);
        } else {
            callback(response);
        }
      });
  },

  emit(event, data) {
    console.log('Emit: ', event, data);
    return socket.emit(event, data);
  },

  removeAllListeners(name) {
    socket.removeAllListeners(name);
  }
};

export default sockets;