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
	playAddColony: 'play:add:colony',
	playTurnEnd: 'play:turn:end'
};

export class Socket {
	constructor(socket) {
		this._socket = socket;
		this._proxies = new Map();
	}

	/**
	 * Listen to an event
	 * @param  {String}   event    The event to listen to
	 * @param  {Function} callback The callback to fire
	 */
	on(event, callback) {
		this._socket.on(event, this.createProxy(callback));
	}

  /**
   * Removes a callback from a given event.
   * If no channel is provided, it removes all callbacks from all channels.
   * @param {String} event the channel name
   * @param {Function?} callback the callback to remove
   */
	off(event, callback) {
		if (callback !== undefined) {
			var proxy = this._proxies.get(callback);
			if (proxy !== undefined) {
				this._socket.removeListener(event, proxy);
				this._proxies.delete(callback);
			} else {
				throw new Error(`Unknown callback for event ${event}`);
			}
		} else {
			this._socket.removeAllListeners(event);
		}
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

	/**
	 * Creates a proxy function for the given callback.
	 * The proxy checks the success status of the response.
	 * @param  {Function} cbk the function to wrap
	 * @return {Function} a proxy function to the callback
	 */
	createProxy(cbk) {
		var proxy = function(response) {
			// console.log(event, response);
			if (response === undefined || response === null || response._success !== false) {
				cbk(response);
			} else {
				window.alert('Error :' + response.message);
			}
		};

		this._proxies.set(cbk, proxy);
		return proxy;
	}
}

export default Socket;
