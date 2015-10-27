import PlacementDelegate from 'client/js/components/listener/delegates/placement';

import { MockSocketIO } from 'libs/mocks/sockets';
import tests from 'client/js/components/libs/test';
import GameManager from 'client/js/components/listener/gameManager';
import { BoardBinding } from 'client/js/components/common/map';
import { Socket, Channel } from 'client/js/components/libs/socket';

describe('PlacementDelegate', function() {
	beforeEach(function() {
		this.socket = new MockSocketIO();
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();
		var helper = BoardBinding.from(this.binding);
		helper.buildBoard({
			tiles: [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 0, y: 1 }
			],
			cities: [{ x: 0, y: 0 }],
			paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
			thieves: { x: 0, y: 0 }
		});
		helper.save(this.binding);
		this.manager = new GameManager(new Socket(this.socket), ctx);
		this.delegate = new PlacementDelegate(this.manager, 13);
	});

	describe('#constructor', function() {
		[Channel.playTurnNew, Channel.playPickColony, Channel.playPickPath].forEach(function(channel) {
			it('starts listening to ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(true);
			});
		});

		it('sets step to null', function() {
			expect(this.delegate._step).toEqual(null);
		});
	});

	describe('#complete', function() {
		beforeEach(function() {
			spyOn(this.manager, 'notifyDelegateCompletion');
			this.delegate.complete(true);
		});

		[Channel.playTurnNew, Channel.playPickColony, Channel.playPickPath].forEach(function(channel) {
			it('stops listening to ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(false);
			});
		});

		it('notifies the manager of the completion', function() {
			expect(this.manager.notifyDelegateCompletion).toHaveBeenCalled();
		});

		it('does not notify manager if told so', function () {
			expect(() => {
				this.delegate.complete(false);
			}).not.toChange(() => this.manager.notifyDelegateCompletion.calls.count());
		});
	});

	describe('on turn start', function() {
		it('resets the step on new player turn', function() {
			this.socket.receive(Channel.playTurnNew, { player: 13 });
			expect(this.delegate._step).toEqual('Init');
		});

		it('does nothing on one\'s else turn', function() {
			this.socket.receive(Channel.playTurnNew, { player: 24 });
			expect(this.delegate._step).not.toEqual('Init');
		});
	});

	describe('#selectCity', function() {
		it('cannot select city at wrong step', function() {
			expect(() => {
				this.delegate.selectCity();
			}).toThrowError();
		});

		describe('at correct step', function() {
			beforeEach(function() {
				this.socket.receive(Channel.playTurnNew, { player: 13 });
				this.delegate.selectCity({ x: 1, y: 2 });
			});

			it(`sends a message on ${Channel.playPickColony}`, function() {
				var message = this.socket.lastMessage(Channel.playPickColony);
				expect(message).toEqual({ colony: { x: 1, y: 2 } });
			});

			describe('on colony picked', function() {
				beforeEach(function() {
					this.socket.receive(Channel.playPickColony, { colony: { x: 1, y: 2 }, player: 13 });
				});

				it('moves to next step', function() {
					expect(this.delegate._step).toEqual('Has spot');
				});
			});
		});
	});

	describe('#selectPath', function() {
		it('cannot select city at wrong step', function() {
			expect(() => {
				this.delegate.selectPath();
			}).toThrowError();
		});

		describe('at correct step', function() {
			beforeEach(function() {
				this.socket.receive(Channel.playTurnNew, { player: 13 });

				var spot = { x: 1, y: 2 };
				this.delegate.selectCity(spot);
				this.socket.receive(Channel.playPickColony, { colony: spot, player: 13 });

				this.path = { from: { x: 1, y: 2 }, to: { x: 1, y: 3 } };
				this.delegate.selectPath(this.path);
			});

			it(`sends a message on ${Channel.playPickPath}`, function() {
				var message = this.socket.lastMessage(Channel.playPickPath);
				expect(message).toEqual({ path: this.path });
			});

			describe('on path picked', function() {
				beforeEach(function() {
					this.socket.receive(Channel.playPickPath, { path: this.path, player: 13 });
				});

				it('moves to final step', function() {
					expect(this.delegate._step).toEqual('Complete');
				});
			});
		});
	});

});
