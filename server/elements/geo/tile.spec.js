import Tile from './tile';
import Location from './location';

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
	});

});
