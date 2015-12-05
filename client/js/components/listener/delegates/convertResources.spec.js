import ConvertResourcesDelegate from 'client/js/components/listener/delegates/convertResources';

import { MockSocketIO } from 'libs/mocks/sockets';
import tests from 'client/js/components/libs/test';
import GameManager from 'client/js/components/listener/gameManager';
import { Socket, Channel } from 'client/js/components/libs/socket';
import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';

describe('ConvertResourcesDelegate', function() {
	beforeEach(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();
		var helper = BoardBinding.from(this.binding);
		helper.buildBoard({
			tiles: [
				{ x: 0, y: 0, resource: 'tuile' },
				{ x: 1, y: 0, resource: 'bois' },
				{ x: 0, y: 1, resource: 'ble' }
			],
			cities: [{ x: 0, y: 1 }],
			paths: [{ from: { x: 0, y: 0 }, to: { x: 2, y: 1 } }],
			thieves: { x: 0, y: 0 }
		});
		helper.save(this.binding);

		var playerBinding = PlayersBinding.from(this.binding);
		playerBinding.setIPlayer(1, 'Me');
		playerBinding.setPlayer(2, 'Mickael');
		playerBinding.save(this.binding);
		this.binding.set('game.currentPlayerId', 1);

		this.socket = new MockSocketIO();
		this.manager = new GameManager(new Socket(this.socket), ctx);
		this.delegate = new ConvertResourcesDelegate(this.manager);
		this.delegate.initialize();
	});

	describe('#initialize', function() {
		[Channel.playResourcesConvert].forEach(function(channel) {
			it('starts listening to ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(true);
			});
		});

		it('sets the current game action', function() {
			expect(this.binding.get('game.action')).toBe(ConvertResourcesDelegate.ACTION);
		});

		it('asks to select a path', function() {
			expect(this.binding.get('game.message')).toEqual('Select card of type to convert.');
		});
	});

	describe('#complete', function() {
		beforeEach(function() {
			spyOn(this.manager, 'notifyDelegateCompletion');
			this.delegate.complete(true);
		});

		[Channel.playResourcesConvert].forEach(function(channel) {
			it('stops listening to ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(false);
			});
		});

		it('deactivates all tiles', function() {
			this.binding.get('game.board.tiles').forEach(colony => {
				expect(colony.get('selectable')).toEqual(false);
			});
		});

		it('unsets the current game action', function() {
			expect(this.binding.get('game.action')).toBe(null);
		});

		it('notifies the manager of the completion', function() {
			expect(this.manager.notifyDelegateCompletion).toHaveBeenCalled();
		});
	});

	describe('#selectCard', function() {
		beforeEach(function() {
			this.delegate.selectCard('mouton');
		});
	});

	describe('#selectTile', function() {
		beforeEach(function() {
			this.delegate.selectCard('mouton');
			const helper = BoardBinding.from(this.binding);
			this.delegate.selectTile(helper.getElement('tiles', { x: 0, y: 0 }));
		});

		it(`sends a message on ${Channel.playResourcesConvert}`, function() {
			var message = this.socket.lastMessage(Channel.playResourcesConvert);
			expect(message).toEqual({ from: 'mouton', to: 'tuile' });
		});

		describe('after operation', function() {
			beforeEach(function() {
				spyOn(this.manager, 'notifyDelegateCompletion');
			});

			describe('on success', function() {
				beforeEach(function() {
					this.socket.receive(Channel.playResourcesConvert, { resources: { tuile: 2, bois: 3 } });
				});

				it('completes the delegate', function() {
					expect(this.manager.notifyDelegateCompletion).toHaveBeenCalled();
				});
			});

			// Unsupported case. Message should not reach the listener
			xdescribe('on failure', function() {});
		});
	})

});
