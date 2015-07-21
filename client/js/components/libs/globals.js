'use strict';

var GLOBALS = {};


// Step const for the game
GLOBALS.step = {
  init: 0,
  prepare: 1,
  started: 2,
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
  mapDice: 'play:roll-dice',
  turnNew: 'turn:new',
  gamePrepare: 'game:prepare',
  gamePlay: 'game:play',
  playTurnNew: 'play:turn:new',
  playPickColony: 'play:pick:colony',
  playPickPath: 'play:pick:path',
  playTurnEnd: 'play:turn:end',
  reconnect: 'reconnect'

};

// resource
GLOBALS.map = {};
GLOBALS.map.resources = {
  tuile: '#851313',
  mouton: '#b4fdc0',
  bois: '#6B5511',
  caillou: '#919191',
  ble: '#DADE64',
  desert: '#E1F507'
};

GLOBALS.map.resourceName = {};
Object.keys(GLOBALS.map.resources).forEach(e => {
  GLOBALS.map.resourceName[e] = e;
});

GLOBALS.interface = {};
GLOBALS.interface.player = {};
GLOBALS.interface.player.colors = [
  /* 0 */ 'yellow',
  /* 1 */ 'red',
  /* 2 */ 'navy',
  /* 3 */ 'silver'
];


export default GLOBALS;