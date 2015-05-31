import Socket from 'client/js/components/libs/socket';

export default class Manager {

  constructor(context) {
    this._events = new Set();

    this._context = context;
    this._binding = context.getBinding();
  }

  listenToSocket(event, callback) {
    Socket.on(event, callback);
  }

  stopListen() {
    this._events.forEach(value => Socket.removeAllListeners(value));
    this._events.clear();
  }

}