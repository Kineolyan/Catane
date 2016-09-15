import _ from 'lodash';

import { MockSocket } from 'server/core/com/mocks';
import { idGenerator } from 'server/core/game/util.js';
import Server from 'server/server';
import User from 'server/core/com/user';

import Games from 'server/core/game/games/games.js';
import BasePlayer from 'server/core/game/players/player';

const playerId = idGenerator();
const games = new Games();

const getServer = (function() {
  let server;
  return function() {
    if (server === undefined) {
      server = new Server();
    }

    return server;
  };
})();

class LocalPlayer {
	constructor(PlayerClass, client, user) {
    this._PlayerClass = PlayerClass;
		this.client = client;
		this.user = user;
	}

	get player() {
		return this.user.player;
	}

	get id() {
		return this.player.id;
	}

	asGamePlayer() {
		this.user.player = new this._PlayerClass(this.user.player);
		return this;
	}
}

class GameEnv {
  constructor(gameName, PlayerClass) {
    this.gameName = gameName
    this._PlayerClass = PlayerClass;
    this.players = null;
    this.game = null;
  }

  /**
   * Creates a new player with its client.
   * @param  {String} name the optional name of the player
   * @return {Object} an object with the :player and its :client
   */
  createServerPlayer(name) {
  	var client = new MockSocket();
  	getServer().connect(client.toSocket());
  	var message = client.lastMessage('init');
  	var id = message.player.id;

  	var info = { client: client, id: id, server: message.server };
  	if (name !== undefined) {
  		client.receive('player:nickname', name);
  		info.name = name;
  	}

  	return info;
  }

  /**
   * Creates a new game with a given number of players.
   * @param  {Integer} nbPlayers the number of players in the game
   * @return {Object} an object with the :game and the :players,
   *    created by #createPlayer.
   */
  createServerGame(nbPlayers) {
  	var players = [];
  	var gameId;
  	for (let i = 0; i < nbPlayers; i += 1) {
  		let p = this.createServerPlayer();
  		players.push(p);
  		if (i === 0) {
  			p.client.receive('game:create', { game: this.gameName });
  			let message = p.client.lastMessage('game:create');
  			gameId = message.game.id;
  		} else {
  			p.client.receive('game:join', gameId);
  		}
  	}

    this.game = { id: gameId };
    this.players = players;
  }

  createLocalPlayer(name) {
  	var client = new MockSocket();
  	var player = new BasePlayer(client.toSocket(), playerId());
  	var user = new User(player.socket, player);
  	if (name !== undefined) {
  		player.name = name;
  	}

  	games.register(user);

  	return new LocalPlayer(this._PlayerClass, client, user);
  }

  createLocalGame(nbPlayers) {
  	this.game = games.create(this.gameName);
  	this.players = [];
  	for (let i = 0; i < nbPlayers; i += 1) {
  		const p = this.createLocalPlayer();
  		this.players.push(p);
  		games.join(this.game, p.user);
  	}
  }
}

export {
  games,
  GameEnv,
  LocalPlayer
};
