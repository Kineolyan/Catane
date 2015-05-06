class Message {
  constructor(defaultMessage = 'Starting...') {
    this._content = defaultMessage;
    this._listener = new Set();
  }

  get content() {
    return this._content;
  }

  set content(val) {
    this._content = val;
    this._listener.forEach(e => e(this._content));
  }

  hasChanged(callback) {
    if(typeof callback !== 'function') {
      throw new Error('Listener is not a function');
    }

    if(!this._listener.has(callback)) {
      this._listener.add(callback);
    }
  }

  removeListener(callback) {
    this._listener.delete(callback);
  } 

  removeAll() {
    this._listener = new Set();
  }
}

export default new Message();