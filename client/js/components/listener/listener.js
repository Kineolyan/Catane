import StartManager from 'client/js/components/listener/startManager';
import GameManager from 'client/js/components/listener/gameManager';

class Listener {

  constructor() {
    this._startManager = null;
    this._gameManager = null;
  }

  startListen(context) {
    this._startManager = new StartManager(context);
    this._gameManager = new GameManager(context);
    this._startManager.startListen();
    this._gameManager.startListen();
  }
}


export default new Listener();