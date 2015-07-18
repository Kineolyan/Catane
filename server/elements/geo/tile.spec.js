import Tile from './tile';

import Location from './location';
import City from './city';
import Player from 'server/game/players/player.js';
import { MockSocket } from '../../com/mocks.js';

describe('Tile', function() {
	describe('constructor', function() {
		beforeEach(function() {
			this.tile = new Tile(2, 1, 'tuile');
		});

		it('is located at (2, 1)', function() {
			expect(this.tile.location).toEqual(new Location(2, 1));
		});

		it('create "tuile"', function() {
			expect(this.tile.resource).toEqual('tuile');
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
			this.tile = new Tile(4, 2, 'tuile', 8);

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

	describe('#distributeResources', function() {
		beforeEach(function() {
			this.tile = new Tile(0, 0, 'ble', 2);

			this.emptySpot = new City(1, 0);
			this.tile.addCity(this.emptySpot);

			this.colony = new City(0, -1);
			this.colony.owner = new Player(new MockSocket().toSocket(), 1);
			this.tile.addCity(this.colony);

			this.city = new City(-1, 1);
			this.city.owner = new Player(new MockSocket().toSocket(), 2);
			this.city.evolve();
			this.tile.addCity(this.city);
		});

		it('gives 1 resource to the colonies', function() {
			expect(() => this.tile.distributeResources())
					.toChangeBy(() => this.colony.owner.resources.ble || 0, 1);
		});

		it('gives twice the resource to the cities', function() {
			expect(() => this.tile.distributeResources())
					.toChangeBy(() => this.city.owner.resources.ble || 0, 2);
		});
	});
});
