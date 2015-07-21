import tests from 'client/js/components/libs/test';
import MapHelper from 'client/js/components/common/map';

import React from 'react/addons';

import Immutable from 'immutable';
import { Surface } from 'react-art';
import GameInterface from 'client/js/components/parts/GameInterface/GameInterface.react';

var utils = React.addons.TestUtils;

describe('A game interface', function() {

	beforeAll(function() {
		this._ctx = tests.getCtx();

		var GameInterfaceB = this._ctx.bootstrap(GameInterface);

		this.game = utils.renderIntoDocument(<GameInterfaceB />);

	});

	it('should not render with no board', function() {
		expect(tests.getRenderedElements(this.message, Surface).length).toEqual(0);
	});

	describe('with a board', function() {

		beforeAll(function(done) {
			this.board = {
				tiles: [
					{ x: 0, y: 0, resource: 'tuile', diceValue: 1 }/*,
					{ x: 1, y: 1, resource: 'tuile', diceValue: 1 },
					{ x: 2, y: -1, resource: 'tuile', diceValue: 1 },
					{ x: 1, y: -2, resource: 'tuile', diceValue: 1 },
					{ x: -1, y: -1, resource: 'tuile', diceValue: 1 },
					{ x: -2, y: 1, resource: 'tuile', diceValue: 1 },
					{ x: -1, y: 2, resource: 'tuile', diceValue: 1 }*/
				], cities: [
					{ x: 0, y: 1 },
					{ x: 1, y: 0 },
					{ x: 1, y: -1 },
					{ x: 0, y: -1 },
					{ x: -1, y: 0 },
					{ x: -1, y: 1 }/*,
					{ x: 1, y: 2 },
					{ x: 2, y: 1 },
					{ x: 2, y: 0 },
					{ x: 0, y: 2 },
					{ x: 3, y: -1 },
					{ x: 3, y: -2 },
					{ x: 2, y: -2 },
					{ x: 2, y: -3 },
					{ x: 1, y: -3 },
					{ x: 0, y: -2 },
					{ x: -1, y: -2 },
					{ x: -2, y: -1 },
					{ x: -2, y: 0 },
					{ x: -2, y: 2 },
					{ x: -3, y: 1 },
					{ x: -3, y: 2 },
					{ x: -1, y: 3 },
					{ x: -2, y: 3 }*/
				], paths: [
					{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } },
					{ from: { x: 1, y: -1 }, to: { x: 1, y: 0 } },
					{ from: { x: 0, y: -1 }, to: { x: 1, y: -1 } },
					{ from: { x: 0, y: -1 }, to: { x: -1, y: 0 } },
					{ from: { x: -1, y: 0 }, to: { x: -1, y: 1 } },
					{ from: { x: -1, y: 1 }, to: { x: 0, y: 1 } }/*,
					{ from: { x: 2, y: 1 }, to: { x: 1, y: 2 } },
					{ from: { x: 2, y: 0 }, to: { x: 2, y: 1 } },
					{ from: { x: 1, y: 0 }, to: { x: 2, y: 0 } },
					{ from: { x: 0, y: 1 }, to: { x: 0, y: 2 } },
					{ from: { x: 0, y: 2 }, to: { x: 1, y: 2 } },
					{ from: { x: 3, y: -1 }, to: { x: 2, y: 0 } },
					{ from: { x: 3, y: -2 }, to: { x: 3, y: -1 } },
					{ from: { x: 2, y: -2 }, to: { x: 3, y: -2 } },
					{ from: { x: 2, y: -2 }, to: { x: 1, y: -1 } },
					{ from: { x: 2, y: -3 }, to: { x: 2, y: -2 } },
					{ from: { x: 1, y: -3 }, to: { x: 2, y: -3 } },
					{ from: { x: 1, y: -3 }, to: { x: 0, y: -2 } },
					{ from: { x: 0, y: -2 }, to: { x: 0, y: -1 } },
					{ from: { x: -1, y: -2 }, to: { x: 0, y: -2 } },
					{ from: { x: -1, y: -2 }, to: { x: -2, y: -1 } },
					{ from: { x: -2, y: -1 }, to: { x: -2, y: 0 } },
					{ from: { x: -2, y: 0 }, to: { x: -1, y: 0 } },
					{ from: { x: -1, y: 1 }, to: { x: -2, y: 2 } },
					{ from: { x: -2, y: 0 }, to: { x: -3, y: 1 } },
					{ from: { x: -3, y: 1 }, to: { x: -3, y: 2 } },
					{ from: { x: -3, y: 2 }, to: { x: -2, y: 2 } },
					{ from: { x: 0, y: 2 }, to: { x: -1, y: 3 } },
					{ from: { x: -2, y: 2 }, to: { x: -2, y: 3 } },
					{ from: { x: -2, y: 3 }, to: { x: -1, y: 3 } }*/
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


	});


});