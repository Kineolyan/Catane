import tests from 'client/js/components/libs/test';
import GameManager from 'client/js/components/listener/gameManager';
import Globals from 'client/js/components/libs/globals';
import MapHelper from 'client/js/components/common/map';
import Immutable from 'immutable';

describe('Game Manager', function() {
	beforeEach(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();

		this.game = new GameManager(ctx);
	});

	describe('pick some element for a player', function() {
		it('throw if not if the good step', function() {
			expect(() => {
				this.game.playPickElement();
			}).toThrow();
		});

		describe('should pick the element', function() {
			beforeEach(function() {
				this.binding.set('step', Globals.step.prepare);
				var board = MapHelper.init({
					tiles: [{ x: 0, y: 0 }],
					cities: [{ x: 0, y: 0 }],
					paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }]
				});
				this.binding.set('game.board', Immutable.fromJS(board));
			});

			it('set a player to a colony', function() {
				this.game.playPickElement({ player: 1, colony: { x: 0, y: 0 } });
				var player = this.binding.get('game.board').toJS().board.getElementOfType('cities', { x: 0, y: 0 }).player;
				expect(player).not.toBeNull();
			});

			it('set the paths selectable after picking a colony', function() {
				this.game.playPickElement({ player: 1, colony: { x: 0, y: 0 } });
				var path = this.binding.get('game.board').toJS().board.getElementOfType('paths', {
					from: { x: 0, y: 0 },
					to: { x: 1, y: 1 }
				});
				expect(path.selectable).toBe(true);
			});

			it('set a player to a path', function() {
				this.game.playPickElement({ player: 1, path: { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } } });
				var player = this.binding.get('game.board').toJS().board.getElementOfType('paths', {
					from: { x: 0, y: 0 },
					to: { x: 1, y: 1 }
				}).player;
				expect(player).not.toBeNull();
			});

			it('set the paths selectable after picking a colony', function() {
				this.game.playPickElement({ player: 1, path: { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } } });
				var path = this.binding.get('game.board').toJS().board.getElementOfType('paths', {
					from: { x: 0, y: 0 },
					to: { x: 1, y: 1 }
				});
				expect(path.selectable).toBe(false);
			});

		});

	});

	it('roll the dice', function() {
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
			var board = MapHelper.init({
				tiles: [{ x: 0, y: 0 }],
				cities: [{ x: 0, y: 0 }],
				paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }]
			});
			this.binding.set('game.board', Immutable.fromJS(board));
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
					var city = this.binding.get('game.board').toJS().board.getElementOfType('cities', { x: 0, y: 0 });
					expect(city.selectable).toBe(true);
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