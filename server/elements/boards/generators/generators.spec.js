import { RoundGenerator } from './generators';
import Location from '../../geo/location';
import City from '../../geo/city';

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

		describe('generated cities', function() {
			beforeEach(function() {
				this.cities = [];
				this.generator.forEachCity( city => this.cities.push(new Location(city.location.x, city.location.y)) );
			});

			it('has 24 items', function() {
				expect(this.cities).toHaveLength(24);
			});

			[
				[0, 1], [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], // tuile centrale
				[0, 2], [1, 2], [2, 1],
				[2, 0], [3, -1], [3, -2],
				[ 2, -2], [2, -3], [1, -3],
				[0, -2], [-1, -2], [-2, -1],
				[-2, 0], [-3, 1], [-3, 2],
				[-2, 2], [-2, 3], [-1, 3]
			].forEach(function(location) {
				var [x, y] = location;

				it(`contains location(${x}, ${y})`, function() {
					expect(this.cities).toContain(new Location(x, y));
				});
			});

			describe('tile-city linking', function() {
				beforeEach(function() {
					this.tiles = new Map();
					this.generator.forEachTile( tile => this.tiles.set(tile.location.hashCode(), tile) );
				});

				[ [0, 0], [1, 1], [2, -1], [1, -2], [-1, -1], [-2, 1], [-1, 2] ].forEach(function(tilePosition) {
					var [tx, ty] = tilePosition;
					var tileLocation = new Location(tx, ty);

					it(`gives tile (${tx}, ${ty}) 6 cities`, function() {
						var tile = this.tiles.get(tileLocation.hashCode());
						expect(tile.cities).toHaveLength(6);
					});

					[ [0, 1], [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1] ].forEach(function(cityLocation) {
						var [cx, cy] = cityLocation;
						cx += tx;
						cy += ty;
						var city = new City(cx, cy);

						it(`associates city (${cx}, ${cy}) to tile (${tx}, ${ty})`, function() {
							var tile = this.tiles.get(tileLocation.hashCode());
							var tileCities = tile.cities.map(function(c) { return c.location.hashCode(); });

							expect(tileCities).toContain(city.location.hashCode());
						});
					});
				});
			});
		});

		describe('generated paths', function() {
			beforeEach(function() {
				this.paths = [];
				this.generator.forEachPath( path => this.paths.push(path) );
			});

			it('has 30 items', function() {
				expect(this.paths).toHaveLength(30);
			});
		});
	});

});
