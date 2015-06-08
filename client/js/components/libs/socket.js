'use strict';

import sock from 'socket.io-client';

var socket = sock();

var inlinePayloads = new Map();

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
   * @param  {[type]} data          The data
   * @param  {Object} inlinePayload The data to associate with an event without transmitting it
   */
  emit(event, data, inlinePayload = {}) {

    if(inlinePayload) {
      if(!inlinePayloads.has(event)) {
        inlinePayloads.set(event, []);
      }

      var inlineData = inlinePayloads.get(event);
      inlineData.push(inlinePayload);

      inlinePayloads.set(event, inlineData);
    } 

    return socket.emit(event, data);
  },

  /**
   * Remove all callbacks for a listener
   * @param  {String} name The event
   */
  removeAllListeners(name) {
    socket.removeAllListeners(name);
  },

  /**
   * Get a payload previously set with emit
   * @param  {String} event The event to extract the payload
   * @return {Object}       The payload
   */
  getInlinePayload(event) {
    if(inlinePayloads.has(event)) {
      var data = inlinePayloads.get(event);
      var payload = data[0];
      data.shift();
      inlinePayloads.set(event, data);

      return payload;
    } else {
      return false;
    }
  }
};

export default sockets;