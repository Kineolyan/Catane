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
	});

});
