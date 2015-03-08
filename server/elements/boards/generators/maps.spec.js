import { RoundGenerator } from './maps';
import Location from '../../geo/location';
import City from '../../geo/city';

describe('The predefined map generators', function() {
	describe('RoundGenerator', function() {
		beforeEach(function() {
			this.generator = new RoundGenerator(2);
		});

		describe('generated tiles', function() {
			beforeEach(function() {
				this.tiles = [];

				this.generator.forEachTile( tile => this.tiles.push(tile) );
				this.tileLocations = this.tiles.map(function(tile) { return tile.location.hashCode(); });
			});

			it('has 7 items', function() {
				expect(this.tiles).toHaveLength(7);
			});

			it('gives a number to each tile but desert', function(){
				this.tiles.forEach(function(tile) {
					if (tile.resource !== 'desert') {
						expect(tile.diceValue).toBeAnInteger();
					}
				});
			});

			it('does not give a number to tile with desert', function(){
				this.tiles.forEach(function(tile) {
					if (tile.resource === 'desert') {
						expect(tile.diceValue).toBeUndefined();
					}
				});
			});

			it('gives a number to each tile', function(){
				var RESOURCES = [ 'desert', 'bois', 'mouton', 'ble', 'caillou', 'tuile' ];
				this.tiles.forEach(function(tile) {
					expect(tile.resource).toBeIn(RESOURCES);
				});
			});

			[
				[0, 0], [1, 1], [2, -1], [1, -2], [-1, -1], [-2, 1], [-1, 2]
			].forEach(function(location) {
				var [x, y] = location;

				it(`contains location(${x}, ${y})`, function() {
					expect(this.tileLocations).toContain(new Location(x, y).hashCode());
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
