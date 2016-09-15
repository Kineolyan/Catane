import * as maps from 'libs/collections/maps.js';
import * as starter from 'server/core/game/games/game-spec.starter.js';

import Location from 'server/catane/elements/geo/location.js';
import CataneGame from 'server/catane/game/games/CataneGame';
import CatanePlayer from 'server/catane/game/players/CatanePlayer';
import Plays from 'server/catane/game/plays/plays.js';

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

starter.games.registerGame(CataneGame);

const plays = new Plays();
class GameEnv extends starter.GameEnv {
	constructor() {
		super(CataneGame.name, CatanePlayer);
	}

	createLocalPlayer(name) {
		const localPlayer = super.createLocalPlayer(name);

		plays.register(localPlayer.user);

		return localPlayer;
	}

	start() {
		this.players[0].client.receive('game:start', this.game.id);

		var message = this.players[0].client.lastMessage('game:start');
		this.thieves = new Location(message.board.thieves.x, message.board.thieves.y);

		// Order players with game order
		var mappedPlayers = {};
		for (let p of this.players) { mappedPlayers[p.id] = p; }
		this.players = [];
		for (let pId of message.players) { this.players.push(mappedPlayers[pId]); }
	}

	/**
	 * Picks a city and a road for the given player.
	 * @param {Object} player the player acting
	 * @param {Number} cityX the x-coordinate of the city
	 * @param {Number} cityY the y-coordinate of the city
	 * @param {Number} toX the x-coordinate of the road end
	 * @param {Number} toY the y-coordinate of the road end
	 */
	pick(player, cityX, cityY, toX, toY) {
		player.client.receive('play:pick:colony', { colony: { x: cityX, y: cityY } });
		player.client.receive('play:pick:path', { path: { from: { x: cityX, y: cityY }, to: { x: toX, y: toY } } });
		player.client.receive('play:turn:end');
	}

	/**
	 * Picks randomly cities for the players.
	 */
	randomPick() {
		var nbOfPicks = this.players.length * 2;
		for (let i = 0; i < nbOfPicks; i += 1) {
			this.pick(this.players[i % this.players.length], ...PICK_ARGS[i]);
		}
	}

	/**
	 * Rolls the dice for the current player
	 * @param {Object} player the player that rolls
	 */
	rollDice(player) {
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
	}

	moveThieves(player) {
		let newThievesLocation = this.thieves.hashCode() === 0 ?
				new Location(1, 1) : new Location(0, 0);
		player.client.receive('play:move:thieves', { tile: newThievesLocation.toJson() });
		this.thieves = newThievesLocation;
	}

	setPlayerResources(index, resources) {
		var player = isNaN(index) ? index.player : this.players[index].player;
		player.useResources(player.resources);
		player.receiveResources(resources);
	}
}

export function createPlayer(name) {
	const env = new GameEnv();
	return env.createServerPlayer(name);
}

export function createGame(nbPlayers) {
	const env = new GameEnv();
	env.createServerGame(nbPlayers);

	return env;
}

export function createLocalPlayer(name) {
	const env = new GameEnv();
	return env.createLocalPlayer(name);
}

export function createLocalGame(nbPlayers) {
	const env = new GameEnv();
	env.createLocalGame(nbPlayers);

	return env;
}
