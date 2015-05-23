'use strict';

import sock from 'socket.io-client';
var socket = sock();

var inlinePayloads = new Map();

var sockets = {
  on(event, callback) {
    socket.on(event, (response) => {

        if(response && response._success === false) {
          window.alert('Error :' + response.message);
        } else {
            callback(response);
        }
      });
  },

  //inlinePayload => data that doesn't transit to the server for local transactions, i.e messages.ok
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

  removeAllListeners(name) {
    socket.removeAllListeners(name);
  },

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