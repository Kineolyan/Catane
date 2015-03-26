import Plays from './plays';

import { MockSocket } from '../../com/mocks';
import Player from '../players/player';

describe('Plays', function() {
	beforeEach(function() {
		this.plays = new Plays();
	});

	describe('#register', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.player = new Player(this.client.toSocket(), 0);
			this.plays.register(this.player);
		});

		// Channels listened
		[
			'play:turn:end', 'play:roll-dice'
		].forEach(function(channel) {
			it(`makes client listen to "${channel}"`, function() {
				expect(this.client).toBeListeningTo(channel);
			});
		});
	});

});