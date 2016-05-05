import Socket from './sockets';
import { idGenerator } from 'server/core/game/util.js';
import { MockSocketIO } from 'libs/mocks/sockets';

var SOCKETS = [];
var socketId = idGenerator();

function createBroadcast(caller) {
	return {
		emit: function(channel, message) {
			for (let socket of SOCKETS) {
				if (socket === caller) { continue; }
				socket.emit(channel, message);
			}
		}
	};
}

const WORLD = {
	emit: function(channel, message) {
		for(let socket of SOCKETS) {
			socket.emit(channel, message);
		}
	}
};

/**
 * Class mocking a socket from Socket.IO.
 */
export class MockSocket extends MockSocketIO {
	constructor() {
		super();

		SOCKETS.push(this);
		this._broadcast = createBroadcast(this);
	}

	get broadcast() {
		return this._broadcast;
	}

	toSocket() {
		return new Socket(socketId(), this, WORLD);
	}
}