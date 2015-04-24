import Location from './location';
import City from './city';

describe('City', function() {

	describe('constructor', function() {
		beforeEach(function() {
			this.city = new City(4, 2);
		});

		it('has located at (4, 2)', function() {
			expect(this.city.location).toEqual(new Location(4, 2));
		});

		it('is not buildable', function() {
			expect(this.city.buildable).toBe(true);
		});

		it('starts as a colony', function() {
			expect(this.city.isCity()).toBe(false);
		});
	});

	describe('#evolve', function() {
		beforeEach(function() {
			this.city = new City(1, 2);
		});

		it('can evolve from colony to city', function() {
			expect(() => this.city.evolve()).toChangeFromTo(() => this.city.isCity(), false, true);
		});

		it('cannot evolve from city', function() {
			this.city.evolve();
			expect(() => this.city.evolve()).toThrowError();
		});
	});

});
