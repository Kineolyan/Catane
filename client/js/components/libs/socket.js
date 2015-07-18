'use strict';

import sock from 'socket.io-client';

var socket = sock();

var sockets = {

  /**
   * Listen to an event
   * @param  {String}   event    The event to listen to
   * @param  {Function} callback The callback to fire
   */
  on(event, callback) {
    socket.on(event, (response) => {
        if(response && response._success === false) {
          window.alert('Error :' + response.message);
        } else {
            callback(response);
        }
      });
  },

  /**
   * Emit some data
   * @param  {String} event         The channel to emit data
   * @param  {*} data          The data
   * @return {*} ??
   */
  emit(event, data) {
    return socket.emit(event, data);
  },

  /**
   * Remove all callbacks for a listener
   * @param  {String} name The event
   */
  removeAllListeners(name) {
    socket.removeAllListeners(name);
  }
};

export default sockets;