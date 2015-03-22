'use strict';

var GLOBALS = {};


// Step const for the game
GLOBALS.step = {
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
GLOBALS.socket = {
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

GLOBALS.map = {};
GLOBALS.map.resources = {
  tuile: '#851313',
  mouton: '#F9FAF2',
  bois: '#6B5511',
  caillou: '#919191',
  ble: '#DADE64',
  desert: '#E1F507'
};

GLOBALS.map.resourceName = {};
var tmp = Object.keys(GLOBALS.map.resources);
for(let k in tmp) {
  if(tmp.hasOwnProperty(k)) {
       GLOBALS.map.resourceName[k] = k;
  }
}


module.exports = GLOBALS;