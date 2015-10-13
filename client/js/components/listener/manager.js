export class SubListener {
  constructor(socket) {
    this._socket = socket;
    this._callbacks = new Map();
  }

  emit(channel, message) {
    this._socket.emit(channel, message);
  }

  /**
   * Listens on a given channel.
   * If a listener was already set, it is removed from listening.
   * @param {String} channel the channel to listen
   * @param {Function} callback the action on new event
   */
  on(channel, callback) {
    var previousCallback = this._callbacks.get(channel);
    if (previousCallback !== undefined) { this._socket.off(channel, previousCallback); }

    this._callbacks.set(channel, callback);
    this._socket.on(channel, callback);
  }

  /**
   * Removes a callback from a given channel.
   * If no channel is provided, it removes all callbacks from all channels.
   * @param {String?} channel the channel name
   */
  off(channel) {
    if (channel !== undefined) {
      var cbk = this._callbacks.get(channel);
      if (cbk) {
        this._socket.off(channel, cbk);
        this._callbacks.delete(channel);
      } else {
        throw new Error(`No callback registered for ${channel}`);
      }
    } else {
      for (let [channel, cbk] of this._callbacks.entries()) {
        this._socket.off(channel, cbk);
      }
      this._callbacks.clear();
    }
  }
}

export class Manager {

  constructor(socket, context) {
    this._socket = socket;

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
    this._socket.on(event, callback);
    this._events.add(event);
  }

  /**
   * Creates a sub-context for listening sockets.
   * This allows to create a dedicated space for socket listening. It is easier
   * to clean that manipulating the global scope.
   * @return {SubListener} a new context
   */
  createSubListener() {
    return new SubListener(this._socket);
  }

  /**
   * Stop the listener
   */
  stopListen() {
    this._events.forEach(value => this._socket.removeAllListeners(value));
    this._events.clear();
  }

  get context() {
    return this._context;
  }
}

export default Manager;
