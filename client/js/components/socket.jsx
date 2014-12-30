'use strict';

if(typeof window.socket === "undefined") {
  window.socket = 0;
}

module.exports = {
  init: function() {
    window.socket = io();
    return window.socket;
  }, 
  socket: function() {
    return window.socket;
  }
};