import 'client/js/components/libs/test';
import MapHelper from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';

describe('The map helper', function() {
	beforeEach(function() {

		this.initBoard = {
			tiles: [
				{ x: 0, y: 0, resource: 'tuile', diceValue: 1 },
				{ x: 1, y: 1, resource: 'tuile', diceValue: 1 },
				{ x: 2, y: -1, resource: 'tuile', diceValue: 1 },
				{ x: 1, y: -2, resource: 'tuile', diceValue: 1 },
				{ x: -1, y: -1, resource: 'tuile', diceValue: 1 },
				{ x: -2, y: 1, resource: 'tuile', diceValue: 1 },
				{ x: -1, y: 2, resource: 'tuile', diceValue: 1 }],
			cities: [
				{ x: 0, y: 1 },
				{ x: 1, y: 0 },
				{ x: 1, y: -1 },
				{ x: 0, y: -1 },
				{ x: -1, y: 0 },
				{ x: -1, y: 1 },
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
				{ x: -2, y: 3 }],
			paths: [
				{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } },
				{ from: { x: 1, y: -1 }, to: { x: 1, y: 0 } },
				{ from: { x: 0, y: -1 }, to: { x: 1, y: -1 } },
				{ from: { x: 0, y: -1 }, to: { x: -1, y: 0 } },
				{ from: { x: -1, y: 0 }, to: { x: -1, y: 1 } },
				{ from: { x: -1, y: 1 }, to: { x: 0, y: 1 } },
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
				{ from: { x: -2, y: 3 }, to: { x: -1, y: 3 } }]
		};

		this.map = MapHelper.init(this.initBoard);
	});

	describe('have the board', function() {
		beforeEach(function() {
			this.board = this.map.board;
		});

		it('should have some paths', function() {
			expect(this.board.elements.has('paths')).toBeTruthy();
		});

		it('should have the good numbers of paths', function() {
			expect(this.board.elements.get('paths').size).toBe(this.initBoard.paths.length);
		});

		it('should have some cities', function() {
			expect(this.board.elements.has('cities')).toBeTruthy();
		});

		it('should have the good numbers of cities', function() {
			expect(this.board.elements.get('cities').size).toBe(this.initBoard.cities.length);
		});

		it('should have some tiles', function() {
			expect(this.board.elements.has('tiles')).toBeTruthy();
		});

		it('should have the good numbers of tiles', function() {
			expect(this.board.elements.get('tiles').size).toBe(this.initBoard.tiles.length);
		});

		describe('get an element', function() {
			it('#', function() {
				expect(this.board.getElementOfType('tiles', this.initBoard.tiles[0])).not.toBeFalsy();
			});

			it('should throw if wrong type', function() {
				expect(() => {
					this.board.getElementOfType('zozo', this.initBoard.tiles[0]);
				}).toThrow();
			});

			it('should return false if no element', function() {
				expect(this.board.getElementOfType('tiles', { x: 0 })).toBeFalsy();
			});
		});


		describe('affect a player', function() {
			beforeEach(function() {
				this.player = PlayersBinding.createPlayer(1, 'bob', 'green');
			});

			it('to a tile', function() {
				this.board.giveElement('tiles', this.initBoard.tiles[1], this.player);

				var b = this.board.getElementOfType('tiles', this.initBoard.tiles[1]);

				expect(b.player).toBe(this.player);
			});

			it('to a path', function() {

				this.board.giveElement('paths', this.initBoard.paths[1], this.player);

				var b = this.board.getElementOfType('paths', this.initBoard.paths[1]);

				expect(b.player).toBe(this.player);
			});

			it('to a city', function() {
				this.board.giveElement('cities', this.initBoard.cities[1], this.player);

				var b = this.board.getElementOfType('cities', this.initBoard.cities[1]);

				expect(b.player).toBe(this.player);
			});
		});

		describe('can make a type selectable', function() {
			it('#tiles', function() {
				this.board.setSelectableType('tiles');
				var count = 0;

				this.board.elements.get('tiles').forEach((elem) => {
					if (elem.selectable) {
						count += 1;
					}
				});
				expect(count).toBe(this.board.elements.get('tiles').size);
			});

			it('#cities', function() {
				this.board.setSelectableType('cities');
				var count = 0;

				this.board.elements.get('cities').forEach((elem) => {
					if (elem.selectable) {
						count += 1;
					}
				});
				expect(count).toBe(this.board.elements.get('cities').size);
			});

			it('#paths', function() {
				this.board.setSelectableType('paths');
				var count = 0;

				this.board.elements.get('paths').forEach((elem) => {
					if (elem.selectable) {
						count += 1;
					}
				});
				expect(count).toBe(this.board.elements.get('paths').size);
			});
		});

	});


});