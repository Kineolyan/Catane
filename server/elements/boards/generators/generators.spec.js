import { RoundGenerator } from './generators';
import Location from '../../geo/location';

describe('The predefined generators', function() {
	describe('RoundGenerator', function() {
		beforeEach(function() {
			this.generator = new RoundGenerator(2);
		});

		describe('generated tiles', function() {
			beforeEach(function() {
				this.tiles = [];

				this.generator.forEachTile( tile => this.tiles.push(new Location(tile.location.x, tile.location.y)) );
			});

			it('has 7 items', function() {
				expect(this.tiles).toHaveLength(7);
			});

			[
				[0, 0], [1, 1], [2, -1], [1, -2], [-1, -1], [-2, 1], [-1, 2]
			].forEach(function(location) {
				var [x, y] = location;

				it(`contains location(${x}, ${y})`, function() {
					expect(this.tiles).toContain(new Location(x, y));
				});
			});
		});
	});

});
