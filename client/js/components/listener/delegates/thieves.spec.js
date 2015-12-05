import ThievesDelegate from 'client/js/components/listener/delegates/thieves';

import { MockSocketIO } from 'libs/mocks/sockets';
import tests from 'client/js/components/libs/test';
import GameManager from 'client/js/components/listener/gameManager';
import { Socket, Channel } from 'client/js/components/libs/socket';
import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';

import Immutable from 'immutable';

describe('ThievesDelegate', function() {
	beforeEach(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();
		var helper = BoardBinding.from(this.binding);
		helper.buildBoard({
			tiles: [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 0, y: 1 },
				{ x: 1, y: 3 }
			],
			cities: [{ x: 0, y: 0 }],
			paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
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
		this.delegate = ThievesDelegate.fromDrop(this.manager, 1, true);

		const subHelper = BoardBinding.sub(this.binding);
		this.getTile = subHelper.getElement.bind(subHelper, 'tiles');
	});

	describe('#constructor', function() {
		[Channel.gameAction, Channel.playMoveThieves, Channel.playResourcesDrop].forEach(function(channel) {
			it('starts listening to ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(true);
			});
		});

		it('is ready to drop cards', function() {
			expect(this.delegate._step).toEqual('Drop cards');
		});
	});

	describe('#complete', function() {
		beforeEach(function() {
			spyOn(this.manager, 'notifyDelegateCompletion');
			this.delegate.complete(true);
		});

		[Channel.gameAction, Channel.playMoveThieves, Channel.playResourcesDrop].forEach(function(channel) {
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

	describe('#selectCard', function() {
		describe('at correct step', function() {
			beforeEach(function() {
				this.binding.set('me.resources', Immutable.fromJS(['bois', 'ble', 'bois']));
				this.delegate.selectCard('bois', 1);
			});

			it(`sends a message on ${Channel.playResourcesDrop}`, function() {
				var message = this.socket.lastMessage(Channel.playResourcesDrop);
				expect(message).toEqual({ bois: 1 });
			});

			it('removes the resource', function() {
				var resources = this.binding.get('me.resources');
				expect(resources.toJS()).toEqual(['bois', 'bois']);
			});

			it('updates the message about remaining elements', function() {
				this.socket.receive(Channel.playResourcesDrop, { remaining: 2 });
				expect(this.binding.get('game.message')).toEqual('Drop 2 resources');
			});

			describe('on card played', function() {
				describe('with more resources to drop', function() {
					it('stays on the same step', function() {
						expect(() => {
							this.socket.receive(Channel.playResourcesDrop, { remaining: 1 });
						}).not.toChange(() => this.delegate._step);
					});
				});

				describe('after the last resource', function() {
					beforeEach(function() {
						this.socket.receive(Channel.playResourcesDrop, { remaining: 0 });
					});

					it('waits for drop phase completion', function() {
						expect(this.delegate._step).toBe('Wait others drops');
					});

					it('asks to wait for the others', function() {
						expect(this.binding.get('game.message')).toMatch(/Wait.+ drop/);
					});
				});
			});
		});
	});

	describe('on action "move thieves"', function() {
		beforeEach(function() {
			this.socket.receive(Channel.gameAction, { action: 'move thieves' });
		});

		it('moves step to "pick tile"', function() {
			expect(this.delegate._step).toEqual('Pick tile');
		});

		it('tells to move the thieves', function() {
			expect(this.binding.get('game.message')).toMatch('Move thieves');
		});

		it('activates the tiles without thieves', function() {
			expect(this.getTile({ x: 0, y: 1 }).get('selectable')).toBe(true);
			expect(this.getTile({ x: 1, y: 0 }).get('selectable')).toBe(true);
		});

		it('deactivates tile with thieves', function() {
			expect(this.getTile({ x: 0, y: 0 }).get('selectable')).not.toBe(true);
		});
	});

	describe('#selectTile', function() {
		it('cannot select tile at wrong step', function() {
			expect(() => {
				this.delegate.selectTile();
			}).toThrowError();
		});

		describe('at correct step', function() {
			beforeEach(function() {
				this.socket.receive(Channel.gameAction, { action: 'move thieves' });
				this.delegate.selectTile(this.getTile({ x: 1, y: 3 }));
			});

			it(`sends a message on ${Channel.playMoveThieves}`, function() {
				var message = this.socket.lastMessage(Channel.playMoveThieves);
				expect(message).toEqual({ tile: { x: 1, y: 3 } });
			});

			xdescribe('on tile selected', function() {
				beforeEach(function() {
					this.socket.receive(Channel.playMoveThieves, { tile: { x: 1, y: 3 } });
				});

				it('moves to next step', function() {
					expect(this.delegate._step).toEqual('Complete');
				});
			});
		});
	});

	describe('not for the current player', function() {
		beforeEach(function() {
			// Not the current player, do not move thieves
			this.binding.set('game.currentPlayerId', 2);
			this.specialDelegate = ThievesDelegate.fromDrop(this.manager, 2, false);
			this.socket.receive(Channel.gameAction, { action: 'move thieves' });
		});

		it('does not have to select tiles after dropping resources', function() {
			expect(this.specialDelegate._step).toEqual('Wait thieves move');
		});

		it('tells that another is moving the thieves', function() {
			expect(this.binding.get('game.message')).toMatch(/moving thieves/i);
		});
	});

	describe('with resources to drop', function() {
		beforeEach(function() {
			this.specialDelegate = ThievesDelegate.fromDrop(this.manager, 0, true);
		});

		it('waits others drop at start', function() {
			expect(this.specialDelegate._step).toBe('Wait others drops');
		});

		it('moves to tile selection once required', function() {
			this.socket.receive(Channel.gameAction, { action: 'move thieves' });
			expect(this.specialDelegate._step).toEqual('Pick tile');
		});
	});

	describe('::fromMove', function() {
		beforeEach('on my turn', function() {
			beforeEach(function() {
				this.specialDelegate = ThievesDelegate.fromMove(this.manager, true);
			});

			it('starts directly from thieves move', function() {
				expect(this.specialDelegate._step).toEqual('Pick tile');
			});
		});

		beforeEach('on else turn', function() {
			beforeEach(function() {
				this.specialDelegate = ThievesDelegate.fromMove(this.manager, false);
			});

			it('is complete', function() {
				expect(this.specialDelegate._step).toEqual('Wait thieves move');
			});
		});
	});

	describe('::getDropMessages', function() {
		it('gets the number of resources to drop', function() {
			expect(ThievesDelegate.getDropMessages(2)).toEqual('Drop 2 resources');
		});

		it('handle plural correctly', function() {
			expect(ThievesDelegate.getDropMessages(1)).toEqual('Drop 1 resource');
		});

		it('has special message when all resources are dropped', function() {
			expect(ThievesDelegate.getDropMessages(0)).toEqual('Waiting for other players to drop resources');
		});
	});

});
