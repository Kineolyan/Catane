import tests from 'client/js/components/libs/test';
import GameManager from 'client/js/components/listener/gameManager';
import Globals from 'client/js/components/libs/globals';
import { Step, Interface } from 'client/js/components/libs/globals';
import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding, MyBinding } from 'client/js/components/common/players';
import { MockSocketIO } from 'libs/mocks/sockets';
import { Socket, Channel } from 'client/js/components/libs/socket';
import LocalStorage from 'client/js/components/libs/localStorage';

import Immutable from 'immutable';

describe('GameManager', function() {
	beforeEach(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();

		var playerBinding = PlayersBinding.from(this.binding);
		playerBinding.setPlayer(2, 'Mickael');
		playerBinding.save(this.binding);

		this.socket = new MockSocketIO();
		this.game = new GameManager(new Socket(this.socket), ctx);
		this.initBoard = function(board) {
			var helper = BoardBinding.from(this.binding);
			helper.buildBoard(board);
			helper.save(this.binding);
		};
	});

	describe('#startListen', function() {
		beforeEach(function() {
			this.game.startListen();
		});

		[
			Channel.gameStart, Channel.gamePrepare, Channel.gamePlay, Channel.gameReload,
			Channel.playTurnNew, Channel.playRollDice, Channel.playPickColony, Channel.playPickPath, Channel.playMoveThieves, Channel.playResourcesDrop,
			Channel.reconnect
		].forEach(function(channel) {
			it('listens to channel ' + channel, function() {
				expect(this.socket.isListening(channel)).toBe(true);
			});
		});
	});

	describe('#onGameStart', function() {
		beforeEach(function() {
			var playersBinding = PlayersBinding.from(this.binding);
			playersBinding.deleteAll();
			playersBinding.setIPlayer(1, 'Oliv');
			playersBinding.setIPlayer(2, 'Pierrick');
			playersBinding.setIPlayer(3, 'Tom');
			playersBinding.save(this.binding);

			// start the game
			this.game.onGameStart({
				board: {
					tiles: [
						{ x: 0, y: 0, resource: 'tuile', diceValue: 1 }
					], cities: [
						{ x: 0, y: 1 },
						{ x: 1, y: 0 },
						{ x: 1, y: -1 }
					], paths: [
						{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } },
						{ from: { x: 1, y: -1 }, to: { x: 1, y: 0 } }
					], thieves: { x: 0, y: 0 }
				}, players: [2, 3, 1]
			});
		});

		it('reorders players', function() {
			var order = this.binding.get('players').map(player => player.get('id'));
			expect(order.toJS()).toEqual([2, 3, 1]);
		});

		it('assigns a color to each player', function() {
			var colors = this.binding.get('players').map(player => player.get('color'));
			expect(colors.toJS()).toEqual(Globals.interface.player.colors.slice(0, 3));
		});

		it('creates the board from data', function() {
			expect(this.binding.get('game.board').toJS()).toBeDefined();
		});

		it('moves to prepare phase', function() {
			expect(this.binding.get('step')).toEqual(Globals.step.prepare);
		});

		it('saves server info in local storage', function() {
			var localStorage = new LocalStorage();
			expect(localStorage.get('server')).toEqual(this.binding.get('server').toJS());
		});
	});

	describe('#reconnect', function() {
		beforeEach(function() {
			this.game.reconnect(1432);
		});

		it('sends a message on channel ' + Channel.reconnect, function() {
			expect(this.socket.messages(Channel.reconnect)).toHaveLength(1);
		});

		it('sends the id of the previous session', function() {
			var message = this.socket.lastMessage(Channel.reconnect);
			expect(message).toEqual(1432);
		});
	});

	describe('#onReconnection', function() {
		beforeEach(function() {
			this.game.onReconnection({ player: { id: 123, name: 'Tom' } });
		});

		it('stores the restored id of the player', function() {
			expect(this.binding.get('me.id')).toEqual(123);
		});

		it('asks for the game reload', function() {
			expect(this.socket.messages(Channel.gameReload)).toHaveLength(1);
		});

		it('save the new server info in local storage', function() {
			var localStorage = new LocalStorage();
			expect(localStorage.get('server')).toEqual(this.binding.get('server').toJS());
		});
	});

	describe('#reloadGame', function() {
		beforeEach(function() {
			this.game.reloadGame();
		});

		it('sends a message on channel ' + Channel.gameReload, function() {
			expect(this.socket.messages(Channel.gameReload)).toHaveLength(1);
		});
	});

	describe('#onGameReload', function() {
		beforeEach(function() {
			this.game.onGameReload({
				board: {
					tiles: [{ x: 0, y: 0 }],
					cities: [{ x: 1, y: 0 }, { x: 0, y: 1 }],
					paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
					thieves: { x: 0, y: 0 }
				}, players: [
					{ id: 7, name: 'Marcus' },
					{ id: 3, name: 'Tom' }
				], currentPlayer: 3,
				me: { resources: { bois: 2, mouton: 3 } }
			});
		});

		it('has the generated board', function() {
			expect(this.binding.get('game.board.tiles')).toHaveSize(1);
			expect(this.binding.get('game.board.cities')).toHaveSize(2);
			expect(this.binding.get('game.board.paths')).toHaveSize(1);
		});

		it('has all players in correct order', function() {
			var ids = this.binding.get('players').map(player => player.get('id')).toJS();
			expect(ids).toEqual([7, 3]);
		});

		it('has given colors to players', function() {
			var colors = this.binding.get('players').map(player => player.get('color')).toJS();
			expect(colors).toEqual([
				Interface.player.colors[0],
				Interface.player.colors[1]
			]);
		});

		it('sets correctly the resources', function() {
			var myBinding = MyBinding.from(this.binding);
			expect(myBinding.resourceMap).toEqual({ bois: 2, mouton: 3 });
		});
	});

	describe('#displayDropStatus', function() {
		describe('with resources to drop', function() {
			beforeEach(function() {
				this.remaining = {};
				this.remaining[1] = 3;
				this.remaining[2] = 4;
				this.game.displayDropStatus({ remaining: this.remaining });
			});

			it('asks to drop the resources', function() {
				expect(this.binding.get('game.message')).toEqual('Drop 3 resources');
			});

			it('handle plural correctly', function() {
				this.remaining[1] = 1;
				this.game.displayDropStatus({ remaining: this.remaining });
				expect(this.binding.get('game.message')).toEqual('Drop 1 resource');
			});
		});

		describe('waiting for others', function() {
			beforeEach(function() {
				var remaining = {};
				remaining[3] = 3;
				remaining[4] = 4;
				this.game.displayDropStatus({ remaining: remaining });
			});

			it('tells to wait', function() {
				expect(this.binding.get('game.message')).toEqual('Waiting for other players to drop resources');
			});
		});
	});

	describe('#askMoveThieves', function() {
		beforeEach(function() {
			this.initBoard({
				tiles: [
					{ x: 0, y: 0 },
					{ x: 1, y: 0 },
					{ x: 0, y: 1 }
				],
				cities: [{ x: 0, y: 0 }],
				paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
				thieves: { x: 0, y: 0 }
			});
		});

		describe('regardless of the player', function() {
			beforeEach(function() {
				// Set any player as current player
				this.binding.set('game.currentPlayerId', 1);
				this.game.askMoveThieves();
			});

			it('activates the tiles without thieves', function() {
				var boardBinding = BoardBinding.from(this.binding);
				expect(boardBinding.getElement('tiles', { x: 0, y: 1 }).get('selectable')).toBe(true);
				expect(boardBinding.getElement('tiles', { x: 1, y: 0 }).get('selectable')).toBe(true);
			});

			it('deactivates tile with thieves', function() {
				var boardBinding = BoardBinding.from(this.binding);
				expect(boardBinding.getElement('tiles', { x: 0, y: 0 }).get('selectable')).toBe(false);
			});
		});

		describe('for me to move', function() {
			beforeEach(function() {
				this.binding.set('game.currentPlayerId', 1);
				this.game.askMoveThieves();
			});

			it('says I must move the thieves', function() {
				var message = this.binding.get('game.message');
				expect(message).toEqual('Move thieves');
			});
		});

		describe('for someone to move', function() {
			beforeEach(function() {
				this.binding.set('game.currentPlayerId', 2);
				this.game.askMoveThieves();
			});

			it('says which player is moving thieves', function() {
				var message = this.binding.get('game.message');
				expect(message).toEqual('Mickael moving thieves');
			});

		});
	});

	describe('#onGameAction', function() {
		describe('on "drop resources"', function() {
			beforeEach(function() {
				this.game.onGameAction({ action: 'drop resources', remaining: { 2: 3 }});
			});

			it('displays message to drop resources', function() {
				expect(this.binding.get('game.message')).toMatch(/Waiting.*drop resources/i);
			});
		});

		describe('on "move thieves"', function() {
			beforeEach(function() {
				this.initBoard({
					tiles: [
						{ x: 0, y: 0 },
						{ x: 1, y: 0 },
						{ x: 0, y: 1 }
					],
					cities: [{ x: 0, y: 0 }],
					paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
					thieves: { x: 0, y: 0 }
				});
				this.binding.set('game.currentPlayerId', 1);
				this.game.onGameAction({ action: 'move thieves' });
			});

			it('tells to move the players', function() {
				expect(this.binding.get('game.message')).toMatch(/mov.* thieves/i);
			});
		});
	});

	describe('#selectTile', function() {
		beforeEach(function() {
			this.game.selectTile({ x: 1, y: 2 });
		});

		it('sends the coordinate of the tile', function() {
			expect(this.socket.messages(Channel.playMoveThieves)).toHaveLength(1);

			var message = this.socket.lastMessage(Channel.playMoveThieves);
			expect(message).toEqual({ tile: { x: 1, y: 2 } });
		});
	});

	describe('#selectCity', function() {
		beforeEach(function() {
			this.game.selectCity({ x: 1, y: 2 });
		});

		it('sends the coordinate of the colony', function() {
			expect(this.socket.messages(Channel.playPickColony)).toHaveLength(1);

			var message = this.socket.lastMessage(Channel.playPickColony);
			expect(message).toEqual({ colony: { x: 1, y: 2 } });
		});
	});

	describe('#selectPath', function() {
		beforeEach(function() {
			this.game.selectPath({ from: { x: 1, y: 2 }, to: { x: 3, y: 4 } });
		});

		it('sends the coordinate of the path', function() {
			expect(this.socket.messages(Channel.playPickPath)).toHaveLength(1);

			var message = this.socket.lastMessage(Channel.playPickPath);
			expect(message).toEqual({ path: { from: { x: 1, y: 2 }, to: { x: 3, y: 4 } } });
		});
	});

	describe('#selectCard', function() {
		describe('to drop resources', function() {
			beforeEach(function() {
				this.binding.set('me.resources', Immutable.fromJS(['bois', 'ble', 'bois']));
				this.game.selectCard('ble', 1);
			});

			it('sends an order to drop resource', function() {
				var message = this.socket.lastMessage(Channel.playResourcesDrop);
				expect(message).toEqual({ ble: 1 });
			});

			it('removes the resource', function() {
				var resources = this.binding.get('me.resources');
				expect(resources.toJS()).toEqual(['bois', 'bois']);
			});
		});
	});

	describe('picking element for a player', function() {
		beforeEach(function() {
			this.binding.set('step', Step.prepare);
			this.initBoard({
				tiles: [{ x: 0, y: 0 }],
				cities: [{ x: 0, y: 0 }],
				paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
				thieves: { x: 0, y: 0 }
			});
		});

		it('throws if not if the good step', function() {
			this.binding.set('step', Step.init);
			expect(() => {
				this.game.playPickElement();
			}).toThrow();
		});

		describe('picking a colony', function() {
			beforeEach(function() {
				this.game.playPickElement({ player: 1, colony: { x: 0, y: 0 } });
				this.boardBinding = BoardBinding.from(this.binding);
			});

			it('marks the colony as picked', function() {
				var city = this.boardBinding.getElement('cities', { x: 0, y: 0 });
				expect(city.get('owner')).toEqual(1);
			});

			it('makes paths selectable', function() {
				expect(this.boardBinding.binding.get('paths').every(path => path.get('selectable') === true)).toBe(true);
			});
		});

		describe('picking a path after a colony', function() {
			beforeEach(function() {
				this.game.playPickElement({ player: 1, colony: { x: 0, y: 0 } });
				this.game.playPickElement({ player: 1, path: { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } } });

				this.boardBinding = BoardBinding.from(this.binding);
			});

			it('assigns the path to the player', function() {
				var path = this.boardBinding.getElement('paths', { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } });
				expect(path.get('owner')).toEqual(1);
			});

			it('unsets paths selectable', function() {
				expect(this.boardBinding.binding.get('paths').every(path => path.get('selectable') !== true)).toBe(true);
			});
		});
	});

	describe('#rollDice', function() {
		beforeEach(function() {
			this.game.rollDice();
		});

		it('sends a message on channel ' + Channel.playRollDice, function() {
			expect(this.socket.messages(Channel.playRollDice)).toHaveLength(1);
		});
	});

	describe('#onRolledDice', function() {
		beforeEach(function() {
			this.game.onRolledDice({ dice: [1, 2], resources: { bois: 3, ble: 4} });
		});

		it('stores the gotten dice values', function() {
			expect(this.binding.get('game.dice.values').toJS()).toEqual([1, 2]);
		});

		it('activates dice rolling flag', function() {
			expect(this.binding.get('game.dice.rolling')).toBe(true);
		});

		it('stores the obtained resources', function() {
			var resources = this.binding.get('game.dice.resources');
			expect(resources.toJS()).toEqual({ bois: 3, ble: 4 });
		});
	});

	describe('#launchGame', function() {
		beforeEach(function() {
			this.game.launchGame({ resources: { bois: 1, ble: 2 } });
		});

		it('sets the step to "started"', function() {
			expect(this.binding.get('step')).toEqual(Globals.step.started);
		});

		it('assigns the received resources to the player', function() {
			var resources = {};
			this.binding.get('me.resources')
					.forEach(resource => resources[resource] = (resources[resource] || 0) + 1);
			expect(resources).toEqual({ bois: 1, ble: 2 });
		});
	});

	it('prepare the game', function() {
		this.game.gamePrepare();
		expect(this.binding.get('step')).toEqual(Globals.step.prepare);
	});

	describe('on new turn', function() {
		beforeEach(function() {
			this.initBoard({
				tiles: [{ x: 0, y: 0 }],
				cities: [{ x: 0, y: 0 }],
				paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
				thieves: { x: 0, y: 0 }
			});
		});

		it('stores the id of the current player', function() {
			this.game.playTurnNew({ player: 1 });
			expect(this.binding.get('game.currentPlayerId')).toEqual(1);
		});

		describe('during preparation', function() {
			beforeEach(function() {
				this.binding.set('step', Globals.step.prepare);
			});

			describe('for "me"', function() {
				beforeEach(function() {
					this.game.playTurnNew({ player: 1 });
				});

				it('enables available cities', function() {
					var cities = this.binding.get('game.board.cities');
					expect(cities.every(city => city.get('selectable') === true)).toBe(true);
				});
			});

			describe('for someone else', function() {
				beforeEach(function() {
					this.game.playTurnNew({ player: 2 });
				});

				it('deactivates all cities', function() {
					var cities = this.binding.get('game.board.cities');
					expect(cities.every(city => city.get('selectable') !== true)).toBe(true);
				});

				it('deactivates all paths', function() {
					var paths = this.binding.get('game.board.paths');
					expect(paths.every(path => path.get('selectable') !== true)).toBe(true);
				});
			});
		});

		describe('during game', function() {
			beforeEach(function() {
				this.binding.set('step', Globals.step.started);
			});

			describe('for "me"', function() {
				beforeEach(function() {
					this.game.playTurnNew({ player: 1 });
				});

				it('enables dice', function() {
					var enabled = this.binding.get('game.dice.enabled');
					expect(enabled).toBe(true);
				});
			});
		});
	});

	describe('#moveThieves', function() {
		beforeEach(function() {
			this.game.moveThieves({ x: 1, y: 2 });
		});

		it('sends a message on channel ' + Channel.playMoveThieves, function() {
			expect(this.socket.messages(Channel.playMoveThieves)).toHaveLength(1);
		});

		it('sends the tile where to place the thieves', function() {
			var message = this.socket.lastMessage(Channel.playMoveThieves);
			expect(message).toEqual({ tile: { x: 1, y: 2 } });
		});
	});

	describe('#onThievesMove', function() {
		beforeEach(function() {
			this.initBoard({
				tiles: [
					{ x: 0, y: 0 },
					{ x: 1, y: 0 },
					{ x: 0, y: 1 },
				], cities: [{ x: 0, y: 0 }],
				paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
				thieves: { x: 0, y: 0 }
			});

			this.game.onThievesMove({ tile: { x: 1, y: 0 } });
		});

		it('removes thieves from the previous tile', function() {
			var boardBinding = BoardBinding.from(this.binding);
			var previousTile = boardBinding.getElement('tiles', { x: 0, y: 0 });
			expect(previousTile.get('thieves')).toBeFalsy();
		});

		it('moves the thieves onto the designated tile', function() {
			var boardBinding = BoardBinding.from(this.binding);
			var newTile = boardBinding.getElement('tiles', { x: 1, y: 0 });
			expect(newTile.get('thieves')).toEqual(true);
		});

		it('does not affect the other tiles', function() {
			var boardBinding = BoardBinding.from(this.binding);
			var tile = boardBinding.getElement('tiles', { x: 0, y: 1 });
			expect(tile.get('thieves')).toBeFalsy();
		});
	});

})
;