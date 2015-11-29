import Morearty from 'morearty';

import { Step } from 'client/js/components/libs/globals';

export function getDefaultContext(player) {
	var myId = player.id;
	var players = [
		{ id: myId, name: player.name, me: true }
	];

	return {
		// state for the start
		start: {
			games: [], // all the available games [{id: 3, id: 6}]
			gameChosen: {} // the game chosen  {id: 2}
		},

		game: {
			currentPlayerId: null, // Id of the current player
			board: {}, // the board for the game, see common/map.js
			dice: { // dice
				enabled: false, // can throw
				rolling: false, // is rolling
				values: [1, 1], // values on the dice
				resources: {} // resources given by the dice
			},
			message: '', // message displayed for the current status
			width: window.innerWidth,
			height: window.innerHeight, // message displayed for the current status
			action: null // Action selected by the player
		},

		// 'I', the first player
		me: {
			id: myId,
			resources: [] // The resources in my deck
		},

		players: players, // all players in the game
		step: Step.init, // current step of the game. See lib/globals.js
		server: null // info send by the server for the reconnect
	};
}

export function createContext(initialState) {
	return Morearty.createContext({ initialState: initialState });
}
