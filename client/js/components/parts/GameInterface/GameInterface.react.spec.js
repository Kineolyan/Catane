import tests from 'client/js/components/libs/test';
import MapHelper from 'client/js/components/common/map';

import Immutable from 'immutable';
import { Surface } from 'react-art';
import GameInterface from 'client/js/components/parts/GameInterface/GameInterface.react';
import EndTurn from 'client/js/components/parts/GameInterface/EndTurn.react';

import Globals from 'client/js/components/libs/globals';

describe('<GameInterface>', function() {

	beforeAll(function() {
		this._ctx = tests.getCtx();
		this.game = tests.bootstrap(this._ctx, GameInterface);
	});

	it('should not render with no board', function() {
		expect(tests.getRenderedElements(this.message, Surface).length).toEqual(0);
	});

	describe('with a board', function() {
		beforeAll(function(done) {
			this.board = {
				tiles: [
					{ x: 0, y: 0, resource: 'tuile', diceValue: 1 }
				], cities: [
					{ x: 0, y: 1 },
					{ x: 1, y: 0 },
					{ x: 1, y: -1 },
					{ x: 0, y: -1 },
					{ x: -1, y: 0 },
					{ x: -1, y: 1 }
				], paths: [
					{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } },
					{ from: { x: 1, y: -1 }, to: { x: 1, y: 0 } },
					{ from: { x: 0, y: -1 }, to: { x: 1, y: -1 } },
					{ from: { x: 0, y: -1 }, to: { x: -1, y: 0 } },
					{ from: { x: -1, y: 0 }, to: { x: -1, y: 1 } },
					{ from: { x: -1, y: 1 }, to: { x: 0, y: 1 } }
				]
			};

			this._ctx.getBinding().set('game.board', Immutable.fromJS(MapHelper.init(this.board)));
			setTimeout(() => {
				done();
			}, 200);
		});

		it('should have the board', function() {
			expect(tests.getRenderedElements(this.game, Surface).length).toBe(1);
		});

		xdescribe('end turn button', function() {
			it('is visible on my turn when game is started', function(done) {
				this._ctx.getBinding().atomically()
						.set('step', Globals.step.started)
						.set('game.currentPlayerId', 1)
						.commit();

				setTimeout(() => {
					expect(tests.getRenderedElements(this.game, EndTurn)).toHaveLength(1);
					done();
				}, 300);
			});

			it('is hidden when the game is not started yet', function(done) {
				this._ctx.getBinding().set('step', Globals.step.prepare);

				setTimeout(() => {
					expect(tests.getRenderedElements(this.game, EndTurn)).toBeEmpty();
					done();
				}, 200);
			});

			it('is hidden on someone\'s else turn', function(done) {
				this._ctx.getBinding().atomically()
						.set('step', Globals.step.started)
						.set('game.currentPlayerId', 2)
						.commit();

				setTimeout(() => {
					expect(tests.getRenderedElements(this.game, EndTurn)).toBeEmpty();
					done();
				}, 200);
			});
		});
	});


});