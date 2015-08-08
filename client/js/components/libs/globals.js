'use strict';

import { Channel } from 'client/js/components/libs/socket';

var GLOBALS = {};

// Step const for the game
export const Step = {
	init: 0,
	prepare: 1,
	started: 2,
	inStep: function(step, max, min) {
		return (step >= min && step <= max);
	}
};

GLOBALS.step = Step;

// TODO Rebinding to remove
GLOBALS.socket = Channel;

// resource
var BoardDef = {
	resources: {
		tuile: '#E86513',
		mouton: '#9CBA64',
		bois: '#AD6242',
		caillou: '#919191',
		ble: '#FFD629',
		desert: '#E1F507'
	},
	resourceName: {}
};

Object.keys(BoardDef.resources).forEach(e => {
	BoardDef.resourceName[e] = e;
});

GLOBALS.map = BoardDef;
export const Board = BoardDef;

export const Interface = {
	player: {
		colors: [
			/* 0 */ 'yellow',
			/* 1 */ 'red',
			/* 2 */ 'navy',
			/* 3 */ 'silver'
		]
	}
};

GLOBALS.interface = Interface;

export default GLOBALS;