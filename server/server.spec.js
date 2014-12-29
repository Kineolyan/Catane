import Server from './server';

describe('Server', function() {
	beforeEach(function() {
		this.server = new Server();
	});

	describe('connection of new client', function() {
		beforeEach(function() {
			this.client = {
				emit: () => 1
			};
			spyOn(this.client, 'emit');

			this.server.connect(this.client);
		});

		it('welcomes the player', function() {
			expect(this.client.emit).toHaveBeenCalledWith('welcome', undefined);
		});

		it('adds the client to its players list', function() {
			expect(this.server.players).toHaveKey(this.client);
		});
	});

});