import { MockSocket } from '../../com/mocks';

import Server from '../../server';

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

const PICK_ARGS = [
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

	return {
		players: players,
		start: function() {
			players[0].client.receive('game:start', gameId);
			
			var message = players[0].client.lastMessage('game:start');
			this.order = message.players;
			for (let tile of message.board.tiles) {
				if (tile.resource === 'desert') { this.thieves = tile.location; }
			}
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
		}
	};
}