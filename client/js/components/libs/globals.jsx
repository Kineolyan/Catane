'use strict';

var GLOBABLS = {};


// Step const for the game 
GLOBABLS.step = {
  init: 0,
  chooseLobby: 1,
  inLobby: 2,
  started: 3,
  ended: 4,
  inStep(step, max, min) {
    return (step >= min && step <= max);
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
  gameQuit: 'game:quit',
  playerNickname: 'player:nickname',
  mapDice: 'map:dice'
};

GLOBABLS.map = {};
GLOBABLS.map.resources = {
  tuile: 'tuile'
};


module.exports = GLOBABLS;