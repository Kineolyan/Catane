import BuildColonyDelegate from 'client/js/components/listener/delegates/buildColony.js';

import { MockSocketIO } from 'libs/mocks/sockets';
import tests from 'client/js/components/libs/test';
import GameManager from 'client/js/components/listener/gameManager';
import { Socket, Channel } from 'client/js/components/libs/socket';
import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';

describe('BuildColonyDelegate', function() {
	beforeEach(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();
		var helper = BoardBinding.from(this.binding);
		helper.buildBoard({
			tiles: [{ x: 0, y: 0 }],
			cities: [
				{ x: 0, y: 0, owner: 1 },
				{ x: 1, y: 0, owner: 2 },
				{ x: 0, y: 1 },
				{ x: 1, y: 1 }
			],
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
		this.delegate = new BuildColonyDelegate(this.manager);
	});

	describe('#constructor', function() {
		[Channel.playAddColony].forEach(function(channel) {
			it('starts listening to ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(true);
			});
		});

		it('asks to select a colony', function() {
			expect(this.binding.get('game.message')).toEqual('Select a colony to settle on.');
		});

		it('activates empty colonies', function() {
			const board = BoardBinding.from(this.binding);
			const colonies = board.getElement.bind(board, 'cities');

			[{ x: 0, y: 0 }, { x: 1, y: 0 }].forEach(colony => {
				expect(colonies(colony).get('selectable')).toEqual(false);
			});

			[{ x: 0, y: 1 }, { x: 1, y: 1 }].forEach(colony => {
				expect(colonies(colony).get('selectable')).toEqual(true);
			});
		});
	});

	describe('#complete', function() {
		beforeEach(function() {
			spyOn(this.manager, 'notifyDelegateCompletion');
			this.delegate.complete(true);
		});

		[Channel.playAddColony].forEach(function(channel) {
			it('stops listening to ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(false);
			});
		});

		it('deactivates all colonies', function() {
			this.binding.get('game.board.cities').forEach(colony => {
				expect(colony.get('selectable')).toEqual(false);
			});
		});

		it('notifies the manager of the completion', function() {
			expect(this.manager.notifyDelegateCompletion).toHaveBeenCalled();
		});
	});

	describe('#selectCity', function() {
		beforeEach(function() {
			this.delegate.selectCity({ x: 2, y: 4 });
		});

		it(`sends a message on ${Channel.playAddColony}`, function() {
			var message = this.socket.lastMessage(Channel.playAddColony);
			expect(message).toEqual({ colony: { x: 2, y: 4 } });
		});

		describe('on settled colony', function() {
			beforeEach(function() {
				spyOn(this.manager, 'notifyDelegateCompletion');
			});

			describe('for the selected colony', function() {
				beforeEach(function() {
					this.socket.receive(Channel.playAddColony, { colony: { x: 2, y: 4 } });
				});

				it('completes the delegate', function() {
					expect(this.manager.notifyDelegateCompletion).toHaveBeenCalled();
				});
			});

			describe('for another colony', function() {
				beforeEach(function() {
					this.socket.receive(Channel.playAddColony, { colony: { x: 1, y: 3 } });
				});

				it('does anything', function() {
					expect(this.manager.notifyDelegateCompletion).not.toHaveBeenCalled();
				});
			});
		});
	});
	//
	// describe('on action "move thieves"', function() {
	// 	beforeEach(function() {
	// 		this.socket.receive(Channel.gameAction, { action: 'move thieves' });
	// 	});
	//
	// 	it('moves step to "pick tile"', function() {
	// 		expect(this.delegate._step).toEqual('Pick tile');
	// 	});
	//
	// 	it('tells to move the thieves', function() {
	// 		expect(this.binding.get('game.message')).toMatch('Move thieves');
	// 	});
	//
	// 	it('activates the tiles without thieves', function() {
	// 		var boardBinding = BoardBinding.from(this.binding);
	// 		expect(boardBinding.getElement('tiles', { x: 0, y: 1 }).get('selectable')).toBe(true);
	// 		expect(boardBinding.getElement('tiles', { x: 1, y: 0 }).get('selectable')).toBe(true);
	// 	});
	//
	// 	it('deactivates tile with thieves', function() {
	// 		var boardBinding = BoardBinding.from(this.binding);
	// 		expect(boardBinding.getElement('tiles', { x: 0, y: 0 }).get('selectable')).not.toBe(true);
	// 	});
	// });
	//
	// describe('#selectTile', function() {
	// 	it('cannot select tile at wrong step', function() {
	// 		expect(() => {
	// 			this.delegate.selectTile();
	// 		}).toThrowError();
	// 	});
	//
	// 	describe('at correct step', function() {
	// 		beforeEach(function() {
	// 			this.socket.receive(Channel.gameAction, { action: 'move thieves' });
	// 			this.delegate.selectTile({ x: 1, y: 3 });
	// 		});
	//
	// 		it(`sends a message on ${Channel.playMoveThieves}`, function() {
	// 			var message = this.socket.lastMessage(Channel.playMoveThieves);
	// 			expect(message).toEqual({ tile: { x: 1, y: 3 } });
	// 		});
	//
	// 		xdescribe('on tile selected', function() {
	// 			beforeEach(function() {
	// 				this.socket.receive(Channel.playMoveThieves, { tile: { x: 1, y: 3 } });
	// 			});
	//
	// 			it('moves to next step', function() {
	// 				expect(this.delegate._step).toEqual('Complete');
	// 			});
	// 		});
	// 	});
	// });
	//
	// describe('not for the current player', function() {
	// 	beforeEach(function() {
	// 		// Not the current player, do not move thieves
	// 		this.binding.set('game.currentPlayerId', 2);
	// 		this.specialDelegate = ThievesDelegate.fromDrop(this.manager, 2, false);
	// 		this.socket.receive(Channel.gameAction, { action: 'move thieves' });
	// 	});
	//
	// 	it('does not have to select tiles after dropping resources', function() {
	// 		expect(this.specialDelegate._step).toEqual('Wait thieves move');
	// 	});
	//
	// 	it('tells that another is moving the thieves', function() {
	// 		expect(this.binding.get('game.message')).toMatch(/moving thieves/i);
	// 	});
	// });
	//
	// describe('with resources to drop', function() {
	// 	beforeEach(function() {
	// 		this.specialDelegate = ThievesDelegate.fromDrop(this.manager, 0, true);
	// 	});
	//
	// 	it('waits others drop at start', function() {
	// 		expect(this.specialDelegate._step).toBe('Wait others drops');
	// 	});
	//
	// 	it('moves to tile selection once required', function() {
	// 		this.socket.receive(Channel.gameAction, { action: 'move thieves' });
	// 		expect(this.specialDelegate._step).toEqual('Pick tile');
	// 	});
	// });
	//
	// describe('::fromMove', function() {
	// 	beforeEach('on my turn', function() {
	// 		beforeEach(function() {
	// 			this.specialDelegate = ThievesDelegate.fromMove(this.manager, true);
	// 		});
	//
	// 		it('starts directly from thieves move', function() {
	// 			expect(this.specialDelegate._step).toEqual('Pick tile');
	// 		});
	// 	});
	//
	// 	beforeEach('on else turn', function() {
	// 		beforeEach(function() {
	// 			this.specialDelegate = ThievesDelegate.fromMove(this.manager, false);
	// 		});
	//
	// 		it('is complete', function() {
	// 			expect(this.specialDelegate._step).toEqual('Wait thieves move');
	// 		});
	// 	});
	// });
	//
	// describe('::getDropMessages', function() {
	// 	it('gets the number of resources to drop', function() {
	// 		expect(ThievesDelegate.getDropMessages(2)).toEqual('Drop 2 resources');
	// 	});
	//
	// 	it('handle plural correctly', function() {
	// 		expect(ThievesDelegate.getDropMessages(1)).toEqual('Drop 1 resource');
	// 	});
	//
	// 	it('has special message when all resources are dropped', function() {
	// 		expect(ThievesDelegate.getDropMessages(0)).toEqual('Waiting for other players to drop resources');
	// 	});
	// });

});
