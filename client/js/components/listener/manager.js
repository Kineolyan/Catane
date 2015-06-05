import Socket from 'client/js/components/libs/socket';

export default class Manager {

  constructor(context) {
    /**
     * All the events
     * @type {Set}
     */
    this._events = new Set();

    /**
     * Morearty context of the app
     * @type {MoreartyContext}
     */
    this._context = context;

    /**
     * The current binding of the app
     * @type {Binding}
     */
    this._binding = context.getBinding();
  }

  /**
   * Listen to a socket
   * @param  {String}   event    The event to listen to
   * @param  {Function} callback Callback to be fired
   */
  listenToSocket(event, callback) {
    Socket.on(event, callback);
    this._events.add(event);
  }

  /**
   * Stop the listener
   */
  stopListen() {
    this._events.forEach(value => Socket.removeAllListeners(value));
    this._events.clear();
  }

}