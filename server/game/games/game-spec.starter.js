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
		}
	};
}