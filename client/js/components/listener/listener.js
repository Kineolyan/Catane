import StartManager from 'client/js/components/listener/startManager';
import GameManager from 'client/js/components/listener/gameManager';

class Listener {

  constructor() {
    this._startManager = null;
    this._gameManager = null;
  }

  startListen(socket, context) {
    this._startManager = new StartManager(socket, context);
    this._gameManager = new GameManager(socket, context);
    this._startManager.startListen();
    this._gameManager.startListen();
  }

  get gameManager() {
    return this._gameManager;
  }

  get startManager() {
    return this._startManager;
  }
}

export const listener = new Listener();

export function startManager() {
  return listener.startManager;
}

export function gameManager() {
  return listener.gameManager;
}

export default listener;