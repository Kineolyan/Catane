'use strict';

// Step event for the game
export const Channel = {
	init: 'init',
	// Server channels
	reconnect: 'server:reconnect',
	// Player channel
	playerNickname: 'player:nickname',
	// Game channels
	gameCreate: 'game:create',
	gameList: 'game:list',
	gameJoin: 'game:join',
	gamePlayers: 'game:players',
	gameStart: 'game:start',
	gameQuit: 'game:quit',
	gamePrepare: 'game:prepare',
	gamePlay: 'game:play',
	gameReload: 'game:reload',
	gameAction: 'game:action',
	// Play channels
	playTurnNew: 'play:turn:new',
	playPickColony: 'play:pick:colony',
	playPickPath: 'play:pick:path',
	playMoveThieves: 'play:move:thieves',
	playRollDice: 'play:roll-dice',
	playResourcesDrop: 'play:resources:drop',
	playTurnEnd: 'play:turn:end'
};

export class Socket {
	constructor(socket) {
		this._socket = socket;
	}

	/**
	 * Listen to an event
	 * @param  {String}   event    The event to listen to
	 * @param  {Function} callback The callback to fire
	 */
	on(event, callback) {
		this._socket.on(event, (response) => {
			// console.log(event, response);
			if(response && response._success === false) {
				window.alert('Error :' + response.message);
			} else {
				throw new Error(`Unknown callback for event ${event}`);
			}
		});
	}

	/**
	 * Emit some data
	 * @param  {String} channel The channel to emit data
	 * @param  {*} data The data
	 * @return {*} ??
	 */
	emit(channel, data) {
		return this._socket.emit(channel, data);
	}

	/**
	 * Remove all callbacks for a listener
	 * @param  {String} name The event
	 */
	removeAllListeners(name) {
		this._socket.removeAllListeners(name);
	}
}

export default Socket;