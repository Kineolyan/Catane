import Globals from '../libs/globals';
import Immutable from 'immutable';
import Manager from './manager';
import Socket from '../libs/socket';
import MapHelper from '../common/map';

export default class StartManager extends Manager {

  constructor(context) {
    this._context = context;
    this._binding = context.getBinding();

    super();
  }

  startListen() {
    this.listenToSocket(Globals.socket.gamePlayers, this.updatePlayerList.bind(this));
    this.listenToSocket(Globals.socket.playerNickname, this.updatePlayerNickname.bind(this));
    this.listenToSocket(Globals.socket.gameStart, this.startGame.bind(this));
    this.listenToSocket(Globals.socket.gameQuit, this.quitGame.bind(this));
    this.listenToSocket(Globals.socket.gameCreate, this.gameCreate.bind(this));
    this.listenToSocket(Globals.socket.gameList, this.updateGameList.bind(this));
    this.listenToSocket(Globals.socket.gameJoin, this.gameJoin.bind(this));

  }

  updatePlayerList(list) {
    var colors = Globals.interface.player.colors;
    var players = this._binding.get('players').toJS();

    players.deleteAll();

    list.players.forEach((player, index) => players.createPlayer(player.id, player.name, colors[index]));
    this._binding.set('players', Immutable.fromJS(players));
  }

  updatePlayerNickname(newPlayer) {
    var players = this._binding.get('players').toJS();
    var player = players.getPlayer(newPlayer.player.id);
    player.name = newPlayer.player.name;

    this._binding.set('players', Immutable.fromJS(players));
  }

  startGame(response) {
    this._binding.atomically()
                .set('board', Immutable.fromJS(new MapHelper(response.board)))
                .set('step', Globals.step.prepare)
                .commit();
  }

  quitGame() {
    var players = this._binding.get('players').toJS();
    players.deleteOthers();

    this._binding.atomically()
                 .set('start.gameChosen', Immutable.fromJS({}))
                 .set('players', Immutable.fromJS(players))
                 .commit();

  }

  gameCreate(game) {
    this._binding.set('start.gameChosen', Immutable.fromJS(game.game));
  }

  updateGameList(list) {
    this._binding.set('start.games', Immutable.fromJS(list.games));
  }

  gameJoin() {
    var game = Socket.getInlinePayload(Globals.socket.gameJoin);
    this._binding.set('start.gameChosen', Immutable.fromJS(game));
  }
}
