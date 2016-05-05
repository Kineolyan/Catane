import { MockSocket } from 'server/core/com/mocks';

import Server from 'server/server';
import Location from 'server/catane/elements/geo/location.js';
import { idGenerator } from 'server/core/game/util.js';
import User from 'server/core/com/user';
import BasePlayer from 'server/core/game/players/player.js';
import CatanePlayer from 'server/catane/game/players/CatanePlayer';
// Managers
import Games from 'server/catane/game/games/games.js';
import Plays from 'server/catane/game/plays/plays.js';
import * as maps from 'libs/collections/maps.js';

export const PICK_ARGS = [
		// Outer city ring
		[ 0, 2, 1, 2 ],
		[ 2, 1, 2, 0 ],
		[ 3, -1, 3, -2 ],
		[ 2, -2, 2, -3 ],
		[ 1, -3, 0, -2 ],
		[ -1, -2, -2, -1],
		[ -2, 0, -3, 1 ],
		[ -3, 2, -2, 2 ],
		[ -2, 3, -1, 1 ],
		// Inner city ring
		[ 1, 0, 1, -1 ],
		[ 0, 1, -1, 0 ],
		[ -1, 1, 0, 1 ]
];

var server = new Server();

/**
 * Creates a new player with its client.
 * @param  {String} name the optional name of the player
 * @return {Object} an object with the :player and its :client
 */
export function createPlayer(name) {
	var client = new MockSocket();
	server.connect(client.toSocket());
	var message = client.lastMessage('init');
	var id = message.player.id;

	var info = { client: client, id: id, server: message.server };
	if (name !== undefined) {
		client.receive('player:nickname', name);
		info.name = name;
	}

	return info;
}

function GameEnv(players, game) {
	this.players = players;
	this.game = game;
}

GameEnv.prototype = {
	start: function() {
		this.players[0].client.receive('game:start', this.game.id);

		var message = this.players[0].client.lastMessage('game:start');
		this.thieves = new Location(message.board.thieves.x, message.board.thieves.y);

		// Order players with game order
		var mappedPlayers = {};
		for (let p of this.players) { mappedPlayers[p.id] = p; }
		this.players = [];
		for (let pId of message.players) { this.players.push(mappedPlayers[pId]); }
	},
	/**
	 * Picks a city and a road for the given player.
	 * @param {Object} player the player acting
	 * @param {Number} cityX the x-coordinate of the city
	 * @param {Number} cityY the y-coordinate of the city
	 * @param {Number} toX the x-coordinate of the road end
	 * @param {Number} toY the y-coordinate of the road end
	 */
	pick: function pick(player, cityX, cityY, toX, toY) {
		player.client.receive('play:pick:colony', { colony: { x: cityX, y: cityY } });
		player.client.receive('play:pick:path', { path: { from: { x: cityX, y: cityY }, to: { x: toX, y: toY } } });
		player.client.receive('play:turn:end');
	},
	/**
	 * Picks randomly cities for the players.
	 */
	randomPick: function() {
		var nbOfPicks = this.players.length * 2;
		for (let i = 0; i < nbOfPicks; i += 1) {
			this.pick(this.players[i % this.players.length], ...PICK_ARGS[i]);
		}
	},
	/**
	 * Rolls the dice for the current player
	 * @param {Object} player the player that rolls
	 */
	rollDice: function(player) {
		player.client.receive('play:roll-dice');
		var message = player.client.lastMessage('play:roll-dice');
		var dice = message.dice[0] + message.dice[1];
		if (dice === 7) {
			// Drop the resoures for all players
			for (let p of this.players) {
				let resources = p.client.lastMessage('play:roll-dice').resources;
				let total = 0;
				for (let [, count] of maps.entries(resources)) { total += count; }
				total = total > 7 ? Math.floor(total / 2) : 0;
				if (total > 0) {
					let dropped = {};
					for (let [res, count] of maps.entries(resources)) {
						if (count <= total) {
							dropped[res] = count;
							total -= count;
						} else {
							dropped[res] = total;
							break;
						}
					}

					p.client.receive('play:resources:drop', dropped);
				}
			}

			this.moveThieves(player);
		}
	},
	moveThieves: function(player) {
		let newThievesLocation = this.thieves.hashCode() === 0 ?
				new Location(1, 1) : new Location(0, 0);
		player.client.receive('play:move:thieves', { tile: newThievesLocation.toJson() });
		this.thieves = newThievesLocation;
	},
	setPlayerResources: function(index, resources) {
		var player = isNaN(index) ? index.player : this.players[index].player;
		player.useResources(player.resources);
		player.receiveResources(resources);
	}
};

/**
 * Creates a new game with a given number of players.
 * @param  {Integer} nbPlayers the number of players in the game
 * @return {Object} an object with the :game and the :players,
 *    created by #createPlayer.
 */
export function createGame(nbPlayers) {
	var players = [];
	var gameId;
	for (let i = 0; i < nbPlayers; i += 1) {
		let p = createPlayer();
		players.push(p);
		if (i === 0) {
			p.client.receive('game:create');
			let message = p.client.lastMessage('game:create');
			gameId = message.game.id;
		} else {
			p.client.receive('game:join', gameId);
		}
	}

	return new GameEnv(players, { id: gameId });
}

const playerId = idGenerator();
const games = new Games();
const plays = new Plays();
class LocalPlayer {
	constructor(client, user) {
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
		this.user.player = new CatanePlayer(this.user.player);
		return this;
	}
}
export function createLocalPlayer(name) {
	var client = new MockSocket();
	var player = new BasePlayer(client.toSocket(), playerId());
	var user = new User(player.socket, player);
	games.register(user);
	plays.register(user);
	if (name !== undefined) {
		player.name = name;
	}

	return new LocalPlayer(client, user);
}

export function createLocalGame(nbPlayers) {
	var game = games.create();
	var players = [];
	for (let i = 0; i < nbPlayers; i += 1) {
		let p = createLocalPlayer();
		players.push(p);
		games.join(game, p.user);
	}

	return new GameEnv(players, game);
}