import tests from 'client/js/components/libs/test';

import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';

// describe('MapHelper', function() {
// 	beforeEach(function() {

// 		this.initBoard = {
// 			tiles: [
// 				{ x: 0, y: 0, resource: 'tuile', diceValue: 1 },
// 				{ x: 1, y: 1, resource: 'tuile', diceValue: 1 },
// 				{ x: 2, y: -1, resource: 'tuile', diceValue: 1 },
// 				{ x: 1, y: -2, resource: 'tuile', diceValue: 1 },
// 				{ x: -1, y: -1, resource: 'tuile', diceValue: 1 },
// 				{ x: -2, y: 1, resource: 'tuile', diceValue: 1 },
// 				{ x: -1, y: 2, resource: 'tuile', diceValue: 1 }],
// 			cities: [
// 				{ x: 0, y: 1 },
// 				{ x: 1, y: 0 },
// 				{ x: 1, y: -1 },
// 				{ x: 0, y: -1 },
// 				{ x: -1, y: 0 },
// 				{ x: -1, y: 1 },
// 				{ x: 1, y: 2 },
// 				{ x: 2, y: 1 },
// 				{ x: 2, y: 0 },
// 				{ x: 0, y: 2 },
// 				{ x: 3, y: -1 },
// 				{ x: 3, y: -2 },
// 				{ x: 2, y: -2 },
// 				{ x: 2, y: -3 },
// 				{ x: 1, y: -3 },
// 				{ x: 0, y: -2 },
// 				{ x: -1, y: -2 },
// 				{ x: -2, y: -1 },
// 				{ x: -2, y: 0 },
// 				{ x: -2, y: 2 },
// 				{ x: -3, y: 1 },
// 				{ x: -3, y: 2 },
// 				{ x: -1, y: 3 },
// 				{ x: -2, y: 3 }],
// 			paths: [
// 				{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } },
// 				{ from: { x: 1, y: -1 }, to: { x: 1, y: 0 } },
// 				{ from: { x: 0, y: -1 }, to: { x: 1, y: -1 } },
// 				{ from: { x: 0, y: -1 }, to: { x: -1, y: 0 } },
// 				{ from: { x: -1, y: 0 }, to: { x: -1, y: 1 } },
// 				{ from: { x: -1, y: 1 }, to: { x: 0, y: 1 } },
// 				{ from: { x: 2, y: 1 }, to: { x: 1, y: 2 } },
// 				{ from: { x: 2, y: 0 }, to: { x: 2, y: 1 } },
// 				{ from: { x: 1, y: 0 }, to: { x: 2, y: 0 } },
// 				{ from: { x: 0, y: 1 }, to: { x: 0, y: 2 } },
// 				{ from: { x: 0, y: 2 }, to: { x: 1, y: 2 } },
// 				{ from: { x: 3, y: -1 }, to: { x: 2, y: 0 } },
// 				{ from: { x: 3, y: -2 }, to: { x: 3, y: -1 } },
// 				{ from: { x: 2, y: -2 }, to: { x: 3, y: -2 } },
// 				{ from: { x: 2, y: -2 }, to: { x: 1, y: -1 } },
// 				{ from: { x: 2, y: -3 }, to: { x: 2, y: -2 } },
// 				{ from: { x: 1, y: -3 }, to: { x: 2, y: -3 } },
// 				{ from: { x: 1, y: -3 }, to: { x: 0, y: -2 } },
// 				{ from: { x: 0, y: -2 }, to: { x: 0, y: -1 } },
// 				{ from: { x: -1, y: -2 }, to: { x: 0, y: -2 } },
// 				{ from: { x: -1, y: -2 }, to: { x: -2, y: -1 } },
// 				{ from: { x: -2, y: -1 }, to: { x: -2, y: 0 } },
// 				{ from: { x: -2, y: 0 }, to: { x: -1, y: 0 } },
// 				{ from: { x: -1, y: 1 }, to: { x: -2, y: 2 } },
// 				{ from: { x: -2, y: 0 }, to: { x: -3, y: 1 } },
// 				{ from: { x: -3, y: 1 }, to: { x: -3, y: 2 } },
// 				{ from: { x: -3, y: 2 }, to: { x: -2, y: 2 } },
// 				{ from: { x: 0, y: 2 }, to: { x: -1, y: 3 } },
// 				{ from: { x: -2, y: 2 }, to: { x: -2, y: 3 } },
// 				{ from: { x: -2, y: 3 }, to: { x: -1, y: 3 } }]
// 		};

// 		this.map = MapHelper.init(this.initBoard);
// 	});

// 	describe('have the board', function() {
// 		beforeEach(function() {
// 			this.board = this.map.board;
// 		});

// 		it('should have some paths', function() {
// 			expect(this.board.elements.has('paths')).toBeTruthy();
// 		});

// 		it('should have the good numbers of paths', function() {
// 			expect(this.board.elements.get('paths').size).toBe(this.initBoard.paths.length);
// 		});

// 		it('should have some cities', function() {
// 			expect(this.board.elements.has('cities')).toBeTruthy();
// 		});

// 		it('should have the good numbers of cities', function() {
// 			expect(this.board.elements.get('cities').size).toBe(this.initBoard.cities.length);
// 		});

// 		it('should have some tiles', function() {
// 			expect(this.board.elements.has('tiles')).toBeTruthy();
// 		});

// 		it('should have the good numbers of tiles', function() {
// 			expect(this.board.elements.get('tiles').size).toBe(this.initBoard.tiles.length);
// 		});

// 		describe('get an element', function() {
// 			it('#', function() {
// 				expect(this.board.getElementOfType('tiles', this.initBoard.tiles[0])).not.toBeFalsy();
// 			});

// 			it('should throw if wrong type', function() {
// 				expect(() => {
// 					this.board.getElementOfType('zozo', this.initBoard.tiles[0]);
// 				}).toThrow();
// 			});

// 			it('should return false if no element', function() {
// 				expect(this.board.getElementOfType('tiles', { x: 0 })).toBeFalsy();
// 			});
// 		});


// 		describe('affect a player', function() {
// 			beforeEach(function() {
// 				this.player = PlayersBinding.createPlayer(1, 'bob', 'green');
// 			});

// 			it('to a tile', function() {
// 				this.board.giveElement('tiles', this.initBoard.tiles[1], this.player);

// 				var b = this.board.getElementOfType('tiles', this.initBoard.tiles[1]);

// 				expect(b.player).toBe(this.player);
// 			});

// 			it('to a path', function() {

// 				this.board.giveElement('paths', this.initBoard.paths[1], this.player);

// 				var b = this.board.getElementOfType('paths', this.initBoard.paths[1]);

// 				expect(b.player).toBe(this.player);
// 			});

// 			it('to a city', function() {
// 				this.board.giveElement('cities', this.initBoard.cities[1], this.player);

// 				var b = this.board.getElementOfType('cities', this.initBoard.cities[1]);

// 				expect(b.player).toBe(this.player);
// 			});
// 		});

// 		describe('can make a type selectable', function() {
// 			it('#tiles', function() {
// 				this.board.setSelectableType('tiles');
// 				var count = 0;

// 				this.board.elements.get('tiles').forEach((elem) => {
// 					if (elem.selectable) {
// 						count += 1;
// 					}
// 				});
// 				expect(count).toBe(this.board.elements.get('tiles').size);
// 			});

// 			it('#cities', function() {
// 				this.board.setSelectableType('cities');
// 				var count = 0;

// 				this.board.elements.get('cities').forEach((elem) => {
// 					if (elem.selectable) {
// 						count += 1;
// 					}
// 				});
// 				expect(count).toBe(this.board.elements.get('cities').size);
// 			});

// 			it('#paths', function() {
// 				this.board.setSelectableType('paths');
// 				var count = 0;

// 				this.board.elements.get('paths').forEach((elem) => {
// 					if (elem.selectable) {
// 						count += 1;
// 					}
// 				});
// 				expect(count).toBe(this.board.elements.get('paths').size);
// 			});
// 		});

// 	});


// });

fdescribe('BoardBinding', function() {
	describe('::buildTile', function() {
		beforeEach(function() {
			this.definition = { x: 10, y: 10, resource: 'tuile', diceValue: 1 };
			this.tile = BoardBinding.buildTile(this.definition);
		});

		it('has coordinates as keys', function() {
			expect(this.tile.key).toEqual({ x: 10, y: 10 });
		});

		it('has converted coordinates', function() {
			expect(this.tile.x).toBeClose(15, 0.1);
			expect(this.tile.y).toBeClose(8.7, 0.1);
		});

		it('has dice value', function() {
			expect(this.tile.diceValue).toEqual(1);
		});

		it('has resource', function() {
			expect(this.tile.resource).toEqual('tuile');
		})

		it('has no player', function() {
			expect(this.tile).not.toHaveKey('player');
		});

		it('supports desert tile', function() {
			var tile = BoardBinding.buildTile({ x: 10, y: 10, resource: 'desert' });
			expect(tile).not.toHaveKey('diceValue');
		});

		it('supports player definition', function() {
			var tile = BoardBinding.buildTile({ x: 10, y: 10, resource: 'tuile', diceValue: 1, player: 123 });
			expect(tile.player).toEqual(123);
		});
	});

	describe('::buildCity', function() {
		beforeEach(function() {
			this.definition = { x: 10, y: 20 };
			this.city = BoardBinding.buildCity(this.definition);
		});

		it('has coordinates as keys', function() {
			expect(this.city.key).toEqual({ x: 10, y: 20 });
		});

		it('has converted coordinates', function() {
			expect(this.city.x).toBeClose(25, 0.1);
			expect(this.city.y).toBeClose(8.7, 0.1);
		});

		it('has no player', function() {
			expect(this.city).not.toHaveKey('player');
		});

		it('supports player definition', function() {
			var city = BoardBinding.buildCity({ x: 10, y: 10, player: 123 });
			expect(city.player).toEqual(123);
		});
	});

	describe('::buildPath', function() {
		beforeEach(function() {
			this.definition = {
				from: { x: 10, y: 20 },
				to: { x: 20, y: 10 }
			};
			this.path = BoardBinding.buildPath(this.definition);
		});

		it('has coordinates as keys', function() {
			expect(this.path.key).toEqual({
				from: { x: 10, y: 20 },
				to: { x: 20, y: 10 }
			});
		});

		it('has converted coordinates', function() {
			expect(this.path.from.x).toBeClose(25, 0.1);
			expect(this.path.from.y).toBeClose(8.7, 0.1);
			expect(this.path.to.x).toBeClose(20, 0.1);
			expect(this.path.to.y).toBeClose(17.4, 0.1);
		});

		it('has no player', function() {
			expect(this.path).not.toHaveKey('player');
		});

		it('supports player definition', function() {
			var path = BoardBinding.buildPath({
				from: { x: 10, y: 20 },
				to: { x: 20, y: 10 },
				player: 123
			});
			expect(path.player).toEqual(123);
		});
	});

	describe('#buildBoard', function() {
		beforeEach(function() {
			this.definition = {
				tiles: [
					{ x: 0, y: 0, resource: 'bois', diceValue: 1 },
					{ x: 1, y: 1, resource: 'desert' }
				], cities: [
					{ x: 0, y: 1 },
					{ x: 1, y: 0 },
					{ x: 1, y: -1 }
				], paths: [
					{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } }
				]
			};

			var ctx = tests.getCtx({ board: {} });
			this.helper = BoardBinding.from(ctx.getBinding());
			this.helper.buildBoard(this.definition);
		});

		// TODO may improve this with behave_like
		it('has 2 adapted tiles', function() {
			var tiles = this.helper.binding.get('tiles').map(tile => tile.get('key')).toJS();
			expect(tiles).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
		});

		it('has 3 adapted cities', function() {
			var cities = this.helper.binding.get('cities').map(city => city.get('key')).toJS();
			expect(cities).toEqual([
				{ x: 0, y: 1 },
				{ x: 1, y: 0 },
				{ x: 1, y: -1 }
			]);
		});

		it('has 1 adapted path', function() {
			var paths = this.helper.binding.get('paths').map(path => path.get('key')).toJS();
			expect(paths).toEqual([{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } }]);
		});
	});

	// 	describe('get an element', function() {
	// 		it('#', function() {
	// 			expect(this.board.getElementOfType('tiles', this.initBoard.tiles[0])).not.toBeFalsy();
	// 		});

	// 		it('should throw if wrong type', function() {
	// 			expect(() => {
	// 				this.board.getElementOfType('zozo', this.initBoard.tiles[0]);
	// 			}).toThrow();
	// 		});

	// 		it('should return false if no element', function() {
	// 			expect(this.board.getElementOfType('tiles', { x: 0 })).toBeFalsy();
	// 		});
	// 	});


	// 	describe('affect a player', function() {
	// 		beforeEach(function() {
	// 			this.player = PlayersBinding.createPlayer(1, 'bob', 'green');
	// 		});

	// 		it('to a tile', function() {
	// 			this.board.giveElement('tiles', this.initBoard.tiles[1], this.player);

	// 			var b = this.board.getElementOfType('tiles', this.initBoard.tiles[1]);

	// 			expect(b.player).toBe(this.player);
	// 		});

	// 		it('to a path', function() {

	// 			this.board.giveElement('paths', this.initBoard.paths[1], this.player);

	// 			var b = this.board.getElementOfType('paths', this.initBoard.paths[1]);

	// 			expect(b.player).toBe(this.player);
	// 		});

	// 		it('to a city', function() {
	// 			this.board.giveElement('cities', this.initBoard.cities[1], this.player);

	// 			var b = this.board.getElementOfType('cities', this.initBoard.cities[1]);

	// 			expect(b.player).toBe(this.player);
	// 		});
	// 	});

	// 	describe('can make a type selectable', function() {
	// 		it('#tiles', function() {
	// 			this.board.setSelectableType('tiles');
	// 			var count = 0;

	// 			this.board.elements.get('tiles').forEach((elem) => {
	// 				if (elem.selectable) {
	// 					count += 1;
	// 				}
	// 			});
	// 			expect(count).toBe(this.board.elements.get('tiles').size);
	// 		});

	// 		it('#cities', function() {
	// 			this.board.setSelectableType('cities');
	// 			var count = 0;

	// 			this.board.elements.get('cities').forEach((elem) => {
	// 				if (elem.selectable) {
	// 					count += 1;
	// 				}
	// 			});
	// 			expect(count).toBe(this.board.elements.get('cities').size);
	// 		});

	// 		it('#paths', function() {
	// 			this.board.setSelectableType('paths');
	// 			var count = 0;

	// 			this.board.elements.get('paths').forEach((elem) => {
	// 				if (elem.selectable) {
	// 					count += 1;
	// 				}
	// 			});
	// 			expect(count).toBe(this.board.elements.get('paths').size);
	// 		});
	// 	});

	// });


});