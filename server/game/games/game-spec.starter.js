import { MockSocket } from '../../com/mocks';

import Server from '../../server';
import Location from '../../elements/geo/location.js';
import { idGenerator } from '../util.js';
import Player from '../players/player.js';
// Managers
import Games from './games.js';
import Plays from '../plays/plays.js';

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
	var id = client.lastMessage('init').id;

	var info = { client: client, id: id };
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
		this.order = message.players;
		for (let tile of message.board.tiles) {
			if (tile.resource === 'desert') { this.thieves = new Location(tile.x, tile.y); }
		}

		// Order players with game order
		var mappedPlayers = {};
		for (let p of this.players) { mappedPlayers[p.id] = p; }
		this.players = [];
		for (let pId of message.players) { this.players.push(mappedPlayers[pId]); }
	},
	/**
	 * Picks a city and a road for the given player.
	 * @param player the player acting
	 * @param cityX the x-coordinate of the city
	 * @param cityY the y-coordinate of the city
	 * @param toX the x-coordinate of the road end
	 * @param toY the y-coordinate of the road end
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
	 */
	rollDice: function(player) {
		player.client.receive('play:roll-dice');
		var message = player.client.lastMessage('play:roll-dice');
		var dice = message.dice[0] + message.dice[1];
		if (dice === 7) {
			let newThievesLocation = this.thieves.hashCode() === 0 ?
				new Location(1, 1) : new Location(0, 0);
			player.client.receive('play:move:thieves', { tile: newThievesLocation.toJson() });
			this.thieves = newThievesLocation;
		}
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
export function createLocalPlayer(name) {
	var client = new MockSocket();
	var player = new Player(client.toSocket(), playerId());
	games.register(player);
	plays.register(player);
	if (name !== undefined) {
		player.name = name;
	}

	return { client: client, id: player.id, player: player };
}

export function createLocalGame(nbPlayers) {
	var game = games.create();
	var players = [];
	for (let i = 0; i < nbPlayers; i += 1) {
		let p = createLocalPlayer();
		players.push(p);
		games.join(game, p.player);
	}

	return new GameEnv(players, game);
}