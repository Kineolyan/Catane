import Globals from '../libs/globals';
import Immutable from 'immutable';
import Manager from './manager';
import Socket from '../libs/socket';

export default class GameManager extends Manager {

  constructor(context) {
    super(context);
  }

  startListen() {
    this.listenToSocket(Globals.socket.gamePrepare, this.gamePrepare.bind(this));
    this.listenToSocket(Globals.socket.gamePlay, this.launchGame.bind(this));
    this.listenToSocket(Globals.socket.playTurnNew, this.playTurnNew.bind(this))
    this.listenToSocket(Globals.socket.mapDice, this.rollDice.bind(this));
    this.listenToSocket(Globals.socket.playPickColony, this.playPickElement.bind(this));
    this.listenToSocket(Globals.socket.playPickPath, this.playPickElement.bind(this));

  }


  /**
   * A player picked somehting on the map
   */
  playPickElement(res) {
    if(this._binding.get('step') === Globals.step.prepare) {
        var players = this._binding.get('players').toJS();
        var board = this._binding.get('game.board');

        var player = players.getPlayer(player);
        var key;
        var payload;

        if(res.colony) {
          key = 'cities';
          payload = res.colony;
          board.setSelectableType('paths')
        } else if(res.path) {
          key = 'paths';
          payload = res.path;
          board.setSelectableType(null)
          Socket.emit(Globals.socket.playTurnEnd);
        }

        board.giveElement(key, payload, player);
        this._binding.set('game.board', Immutable.fromJS(board));
    }
  }

  /**
   * Roll the dice
   */
  rollDice({dice: dice}) {
    this._binding.atomically()
                 .set('game.dice.values', Immutable.fromJS(dice))
                 .set('game.dice.rolling', true)
                 .commit();
  }

  /**
   * Launch the game
   */
  launchGame() {
    this._binding.set('step', Globals.step.started);
  }

  /**
   * Set the game in the preparation mode
   */
  gamePrepare() {
    this._binding.set('step', Globals.step.prepare);
  }

  /**
   * New player started to play
   */
  playTurnNew({player: player}) {
    var players = this._binding.get('players').toJS();
    var board = this._binding.get('game.board');

    var playing = players.getPlayer(player);

    var transaction = this._binding.atomically();

    if(playing.isMe()) {
      if(this._binding.get('step') === Globals.step.prepare) {
        transaction.set('game.message', 'Choose a colony then a path');
        board.setSelectableType('cities');

      } else {
        transaction.set('message', 'Roll the dice');
        transaction.set('dice.enabled', true);
      }
    } else {
        transaction.set('game.message', `Playing : ${playing.name}`);

        board.setSelectableType(null);
    }
    
    transaction.set('game.board', Immutable.fromJS(board));
    transaction.commit();
  }

}
