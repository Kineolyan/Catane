import Tile from './tile';
import Location from './location';
import City from './city';

describe('Tile', function() {
	describe('constructor', function() {
		beforeEach(function() {
			this.tile = new Tile(2, 1, 'tuile');
		});

		it('is located at (2, 1)', function() {
			expect(this.tile.location).toEqual(new Location(2, 1));
		});

		it('create "tuile"', function() {
			expect(this.tile.resource).toEqual("tuile");
		});

		it('has no cities', function() {
			expect(this.tile.cities).toBeEmpty();
		});

		it('has no dice value', function() {
			expect(this.tile.diceValue).not.toBeDefined();
		});
	});

	describe('cities management', function() {
		beforeEach(function() {
			this.tile = new Tile(4, 2, 'tuile');

			this.city = new City(4, 3);
			this.tile.addCity(this.city);
		});

		it('is holded by the city', function() {
			expect(this.tile.cities).toEqual([ this.city ]);
		});
	});

	describe('#diceValue', function() {
		beforeEach(function() {
			this.tile = new Tile(2, 1, 'tuile');
		});

		it('can set the dice value', function() {
			this.tile.diceValue = 12;
			expect(this.tile.diceValue).toEqual(12);
		});
	});


});
