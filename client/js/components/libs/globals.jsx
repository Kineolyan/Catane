'use strict';

var GLOBABLS = {};


// Step const for the game 
GLOBABLS.step = {
  init: 0,
  chooseLobby: 1,
  inLobby: 2,
  started: 3
};

// Step event for the game 
GLOBABLS.socket = {
  init: 'init',
  gameCreate: 'game:create',
  gameList: 'game:list',
  playerNickname: 'player:nickname'
};

module.exports = GLOBABLS;