import Player from './player';
import { MockSocket } from './../../com/mocks';

describe('Player', function() {
	beforeEach(function() {
		this.socket = new MockSocket();
	});

	describe('on creation', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket(), '1');
		});

		it('registers on player:nickname', function() {
			expect(this.socket.isListening('player:nickname')).toBeTruthy();
		});

		it('has a default name', function() {
			expect(this.player.name).toEqual('Player 1');
		});

		it('has an id', function() {
			expect(this.player.id).toEqual('1');
		});

		it('does not have any resources', function() {
			expect(this.player.resources).toEqual({});
		});

		it('has no cards', function() {
			expect(this.player.cards).toEqual({});
		});

		it('has a null score', function() {
			expect(this.player.score).toEqual(0);
		});
	});

	describe('#name', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
			this.player.name = 'Olivier';
		});

		it('sets name', function() {
			expect(this.player.name).toEqual('Olivier');
		});
	});

	describe('#toJson', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket(), 1342);
			this.player.name = 'Olivier';
		});

		it('returns basic object with name and id', function() {
			expect(this.player.toJson()).toEqual({ id: 1342, name: 'Olivier' });
		});
	});

	describe('#hasResources', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
		});

		it('returns true if there is enough', function() {
			this.player.receiveResources({ bois: 2, mouton: 3, ble: 4 });
			expect(this.player.hasResources({ bois: 1, ble: 3 })).toBe(true);
		});

		it('returns false if there is not enough', function() {
			this.player.receiveResources({ bois: 2, mouton: 3, ble: 4 });
			expect(this.player.hasResources({ caillou: 1, bois: 3 })).toBe(false);
		});

		it('supports border cases', function() {
			this.player.receiveResources({ bois: 2, mouton: 3, ble: 4 });
			expect(this.player.hasResources({ bois: 2, mouton: 3 })).toBe(true);
		});

		/* jshint loopfunc: true */
		for (let wrongCost of ['value', [], {}]) {
			it(`rejects wrong cost such as '${wrongCost}'`, function() {
				expect(() => this.player.hasResources({ bois: wrongCost })).toThrowError(TypeError, /is not a number/i);
			});
		}
	});

	describe('#receiveResources', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
		});

		it('updates the number of resources from an array', function() {
			this.player.receiveResources(['ble', 'bois', 'mouton', 'ble']);
			expect(this.player.resources).toEqual({ ble: 2, mouton: 1, bois: 1 });
		});

		it('updates the number of resources from a hash', function() {
			this.player.receiveResources({ ble: 2, bois: 1, mouton: 1 });
			expect(this.player.resources).toEqual({ ble: 2, mouton: 1, bois: 1 });
		});
	});

	describe('#useResources', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
			this.player.receiveResources({ ble: 3, bois: 2, caillou: 1 });
		});

		it('updates the number of resources from an array', function() {
			this.player.useResources(['ble', 'bois', 'caillou', 'ble']);
			expect(this.player.resources).toEqual({ ble: 1, caillou: 0, bois: 1 });
		});

		it('updates the number of resources from a hash', function() {
			this.player.useResources({ ble: 2, bois: 1, caillou: 1 });
			expect(this.player.resources).toEqual({ ble: 1, caillou: 0, bois: 1 });
		});
	});

	describe('#addCard', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
			this.card = { id: 1 };
			this.player.addCard(this.card);
		});

		it('records the card by its id', function() {
			expect(this.player.cards[this.card.id]).toBe(this.card);
		});
	});

	describe('#useCard', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
			this.card = jasmine.createSpyObj('player', ['prepare', 'applyOn']);
			this.card.applyOn.and.returnValue('reply');
			this.card.id = '74';
			this.player.addCard(this.card);
		});

		describe('for existing card', function() {
			beforeEach(function() {
				this.player.game = 'game';
				this.res = this.player.useCard(this.card.id, { dice: 2 });
			});

			it('prepares the card with the arguments', function() {
				expect(this.card.prepare.calls.mostRecent().args).toEqual([{ dice: 2 }]);
			});

			it('executes the card action for the player', function() {
				expect(this.card.applyOn.calls.mostRecent().args).toEqual([{ player: this.player, game: 'game' }]);
			});

			it('returns the result of the card execution', function() {
				expect(this.res).toEqual('reply');
			});

			it('removes the card from the player list', function() {
				expect(this.player.cards).not.toHaveKey(this.card.id);
			});
		});

		it('throws if the card does not exist', function() {
			expect(() => this.player.useCard(4275)).toThrowError(/no card 4275/i);
		});
	});

	describe('#winPoints', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
		});

		it('increments the score by the number of points', function() {
			expect(() => this.player.winPoints(2)).toChangeBy(() => this.player.score, 2)
		});

		it('fails if the value is negative', function() {
			expect(() => this.player.winPoints(-1)).toThrow();
			expect(() => this.player.winPoints(0)).toThrow();
		})
	});

	describe('->player:nickname', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket(), 1);
			this.another = new MockSocket();

			this.socket.receive('player:nickname', 'Olivier');
		});

		it('sets name to Olivier', function() {
			expect(this.player.name).toEqual('Olivier');
		});

		it('sends success', function() {
			var message = this.socket.lastMessage('player:nickname');
			expect(message._success).toEqual(true);
		});

		it('sends the new name', function() {
			var message = this.socket.lastMessage('player:nickname');
			expect(message.player.name).toEqual('Olivier');
			expect(message.player.id).toEqual(1);
		});

		it('notifies others of the change', function() {
			var message = this.another.lastMessage('player:nickname');
			expect(message.player).toEqual({ id: 1, name: 'Olivier' });
		});
	});

});