import tests from 'client/js/components/libs/test';
import GameManager from 'client/js/components/listener/gameManager';
import Globals from 'client/js/components/libs/globals';
import { Step, Interface } from 'client/js/components/libs/globals';
import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding, MyBinding } from 'client/js/components/common/players';
import { MockSocketIO } from 'libs/mocks/sockets';
import { Socket, Channel } from 'client/js/components/libs/socket';
import LocalStorage from 'client/js/components/libs/localStorage';

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
					paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }]
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

	describe('picking element for a player', function() {
		beforeEach(function() {
			this.binding.set('step', Step.prepare);
			this.initBoard({
				tiles: [{ x: 0, y: 0 }],
				cities: [{ x: 0, y: 0 }],
				paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }]
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

	it('rolls the dice', function() {
		this.game.rollDice([1, 2]);
		expect(this.binding.get('game.dice.rolling')).toBe(true);
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
				paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }]
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

})
;