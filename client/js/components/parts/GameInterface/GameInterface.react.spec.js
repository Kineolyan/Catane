import tests from 'client/js/components/libs/test';
import { BoardBinding } from 'client/js/components/common/map';

import { Surface } from 'react-art';
import GameInterface from 'client/js/components/parts/GameInterface/GameInterface.react';
import EndTurn from 'client/js/components/parts/GameInterface/EndTurn.react';

import Globals from 'client/js/components/libs/globals';

describe('<GameInterface>', function() {
	beforeAll(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();

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
			], thieves: { x: 0, y: 0 }
		};
		var boardBinding = BoardBinding.from(this.binding);
		boardBinding.buildBoard(this.board);
		boardBinding.save(this.binding);

		this.game = tests.bootstrap(ctx, GameInterface);
	});

	it('should have the board', function() {
		expect(tests.getRenderedElements(this.game, Surface)).toHaveLength(1);
	});

	xdescribe('end turn button', function() {
		it('is visible on my turn when game is started', function(done) {
			this.binding.atomically()
					.set('step', Globals.step.started)
					.set('game.currentPlayerId', 1)
					.commit();

			setTimeout(() => {
				expect(tests.getRenderedElements(this.game, EndTurn)).toHaveLength(1);
				done();
			}, 300);
		});

		it('is hidden when the game is not started yet', function(done) {
			this.binding.set('step', Globals.step.prepare);

			setTimeout(() => {
				expect(tests.getRenderedElements(this.game, EndTurn)).toBeEmpty();
				done();
			}, 200);
		});

		it('is hidden on someone\'s else turn', function(done) {
			this.binding.atomically()
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