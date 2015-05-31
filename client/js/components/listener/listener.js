import StartManager from 'client/js/components/listener/startManager';
import GameManager from 'client/js/components/listener/GameManager';

export default class Listener {

  constructor(context) {

    this._startManager = new StartManager(context);
    this._gameManager = new GameManager(context);
  }

  startListen() {
    this._startManager.startListen();
    this._gameManager.startListen();
  }
}