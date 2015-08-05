import tests from 'client/js/components/libs/test';
import GameManager from 'client/js/components/listener/gameManager';
import Globals from 'client/js/components/libs/globals';
import { Step } from 'client/js/components/libs/globals';
import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';

import Immutable from 'immutable';

describe('GameManager', function() {
	beforeEach(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();

		var playerBinding = PlayersBinding.from(this.binding);
		playerBinding.setPlayer(2, 'Mickael');
		playerBinding.save(this.binding);

		this.game = new GameManager(ctx);
		this.initBoard = function(board) {
			var helper = BoardBinding.from(this.binding);
			helper.buildBoard(board);
			helper.save(this.binding);
		};
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
				expect(city.get('player')).toEqual(1);
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
				expect(path.get('player')).toEqual(1);
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