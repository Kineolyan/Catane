import BuildRoadDelegate from 'client/js/components/listener/delegates/buildRoad.js';

import { MockSocketIO } from 'libs/mocks/sockets';
import tests from 'client/js/components/libs/test';
import GameManager from 'client/js/components/listener/gameManager';
import { Socket, Channel } from 'client/js/components/libs/socket';
import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';

describe('BuildRoadDelegate', function() {
	beforeEach(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();
		var helper = BoardBinding.from(this.binding);
		helper.buildBoard({
			tiles: [{ x: 0, y: 0 }],
			cities: [{ x: 0, y: 1 }],
			paths: [
				{ from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, owner: 1 },
				{ from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, owner: 2 },
				{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
				{ from: { x: 0, y: 0 }, to: { x: 2, y: 1 } },
				{ from: { x: 2, y: 4 }, to: { x: 1, y: 3 } }
			],
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
		this.delegate = new BuildRoadDelegate(this.manager);
		this.delegate.initialize();

		const subHelper = BoardBinding.sub(this.binding);
		this.getPath = subHelper.getElement.bind(subHelper, 'paths');
	});

	describe('#constructor', function() {
		[Channel.playAddRoad].forEach(function(channel) {
			it('starts listening to ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(true);
			});
		});

		it('asks to select a path', function() {
			expect(this.binding.get('game.message')).toEqual('Select a path to build.');
		});

		it('sets the current game action', function() {
			expect(this.binding.get('game.action')).toBe(BuildRoadDelegate.ACTION);
		});

		it('activates empty paths', function() {
			[
				{ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
				{ from: { x: 0, y: 0 }, to: { x: 0, y: 1 } }
			].forEach(path => {
				expect(this.getPath(path).get('selectable')).toEqual(false);
			});

			[
				{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
				{ from: { x: 0, y: 0 }, to: { x: 2, y: 1 } }
			].forEach(path => {
				expect(this.getPath(path).get('selectable')).toEqual(true);
			});
		});
	});

	describe('#complete', function() {
		beforeEach(function() {
			spyOn(this.manager, 'notifyDelegateCompletion');
			this.delegate.complete(true);
		});

		[Channel.playAddRoad].forEach(function(channel) {
			it('stops listening to ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(false);
			});
		});

		it('deactivates all colonies', function() {
			this.binding.get('game.board.paths').forEach(colony => {
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

	describe('#selectPath', function() {
		beforeEach(function() {
			this.delegate.selectPath(this.getPath({ from: { x: 2, y: 4 }, to: { x: 1, y: 3 } }));
		});

		it(`sends a message on ${Channel.playAddRoad}`, function() {
			var message = this.socket.lastMessage(Channel.playAddRoad);
			expect(message).toEqual({ path: { from: { x: 2, y: 4 }, to: { x: 1, y: 3 } } });
		});

		describe('on built path', function() {
			beforeEach(function() {
				spyOn(this.manager, 'notifyDelegateCompletion');
			});

			describe('for the built path', function() {
				beforeEach(function() {
					this.socket.receive(Channel.playAddRoad, { path: {
						from: { x: 2, y: 4 },
						to: { x: 1, y: 3 } }
					});
				});

				it('completes the delegate', function() {
					expect(this.manager.notifyDelegateCompletion).toHaveBeenCalled();
				});
			});

			describe('for another path', function() {
				beforeEach(function() {
					this.socket.receive(Channel.playAddRoad, { colony: { x: 1, y: 3 } });
				});

				it('does anything', function() {
					expect(this.manager.notifyDelegateCompletion).not.toHaveBeenCalled();
				});
			});
		});
	});

});
