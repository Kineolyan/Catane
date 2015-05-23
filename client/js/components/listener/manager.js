import Socket from '../libs/socket';

export default class Manager {

  constructor() {
    this._events = new Set();
  }

  listenToSocket(event, callback) {
    Socket.on(event, callback);
  }

  stopListen() {
    this._events.forEach(value => Socket.removeAllListeners(value));
    this._events.clear();
  }

}