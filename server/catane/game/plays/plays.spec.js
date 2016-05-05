import Plays from './plays';

import { MockSocket } from 'server/core/com/mocks';
import User from 'server/core/com/user';
import Player from 'server/core/game/players/player';

describe('Plays', function() {
	beforeEach(function() {
		this.plays = new Plays();
	});

	describe('#register', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.player = new Player(this.client.toSocket(), 0);
			this.plays.register(new User(this.player.socket, this.player));
		});

		// Channels listened
		[
			'play:pick:colony', 'play:pick:path',
			'play:roll-dice', 'play:move:thieves',
			'play:add:colony', 'play:add:road', 'play:evolve:city',
			'play:resources:drop', 'play:resources:convert', 'play:resources:offer', 'play:resources:exchange',
			'play:turn:end'
		].forEach(function(channel) {
			it(`makes client listen to "${channel}"`, function() {
				expect(this.client).toBeListeningTo(channel);
			});
		});
	});

});
