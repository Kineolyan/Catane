import Immutable from 'immutable';

import Globals from 'client/js/components/libs/globals';
import Manager from 'client/js/components/listener/manager';
import Socket from 'client/js/components/libs/socket';
import MapHelper from 'client/js/components/common/map';


/**
 * Manager for the starting part
 * @class
 */
export default class StartManager extends Manager {

  /**
   * Start listening 
   */

  startListen() {
    this.listenToSocket(Globals.socket.gamePlayers, this.updatePlayerList.bind(this));
    this.listenToSocket(Globals.socket.playerNickname, this.updatePlayerNickname.bind(this));
    this.listenToSocket(Globals.socket.gameStart, this.startGame.bind(this));
    this.listenToSocket(Globals.socket.gameQuit, this.quitGame.bind(this));
    this.listenToSocket(Globals.socket.gameCreate, this.gameCreate.bind(this));
    this.listenToSocket(Globals.socket.gameList, this.updateGameList.bind(this));
    this.listenToSocket(Globals.socket.gameJoin, this.gameJoin.bind(this));

  }

  /**
   * Update the player in the game
   * @param  {Array.{id, name}} list The list of player
   */
  updatePlayerList(list) {
    var colors = Globals.interface.player.colors;
    var players = this._binding.get('players').toJS();

    //delete the players
    players.deleteAll();

    //re-create a new list
    list.players.forEach((player, index) => players.createPlayer(player.id, player.name, colors[index]));

    //save
    this._binding.set('players', Immutable.fromJS(players));
  }

  /**
   * Update the name of one player
   * @param  {Object} newPlayer The player with the new name
   */
  updatePlayerNickname(newPlayer) {
    var players = this._binding.get('players').toJS();
    var player = players.getPlayer(newPlayer.player.id);

    //change the name
    player.name = newPlayer.player.name;

    this._binding.set('players', Immutable.fromJS(players));
  }

  /**
   * Start the game with a board
   * @param  {Object} options.board: board  The original board
   */
  startGame({board: board}) {
    this._binding.atomically()
                .set('game.board', Immutable.fromJS(MapHelper.init(board)))
                .set('step', Globals.step.prepare)
                .commit();
  }

  /**
   * Leave the current game
   */
  quitGame() {
    var players = this._binding.get('players').toJS();
    //delete the others players
    players.deleteOthers();

    //reset the selection
    this._binding.atomically()
                 .set('start.gameChosen', Immutable.fromJS({}))
                 .set('players', Immutable.fromJS(players))
                 .commit();

  }

  /**
   * Create a new game
   * @param  {Object} options.game: game The created game
   */
  gameCreate({game: game}) {
    this._binding.set('start.gameChosen', Immutable.fromJS(game));
  }

  /**
   * Update the list of availables games
   * @param  {Object} options.games: games All the availables games
   */
  updateGameList({games: games}) {
    this._binding.set('start.games', Immutable.fromJS(games));
  }

  /**
   * Join a game
   */
  gameJoin() {
    //get the game as inline payload
    var game = Socket.getInlinePayload(Globals.socket.gameJoin);
    this._binding.set('start.gameChosen', Immutable.fromJS(game));
  }
}
