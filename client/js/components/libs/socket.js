'use strict';

// Step event for the game
export const Channel = {
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
					callback(response);
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