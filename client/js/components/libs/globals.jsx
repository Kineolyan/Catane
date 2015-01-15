'use strict';

var GLOBABLS = {};


// Step const for the game 
GLOBABLS.step = {
  init: 0,
  chooseLobby: 1,
  inLobby: 2,
  started: 3,
  inStep(step, max, min) {
    return (step > min && step <= max);
  }
};

// Step event for the game 
GLOBABLS.socket = {
  init: 'init',
  gameCreate: 'game:create',
  gameList: 'game:list',
  gameJoin: 'game:join',
  gamePlayers: 'game:players',
  gameStart: 'game:start',
  playerNickname: 'player:nickname'
};

module.exports = GLOBABLS;