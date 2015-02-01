import Location from './location';

describe('Location', function() {
	describe('constructor', function() {
		beforeEach(function() {
			this.point = new Location(2, 3);
		});

		it('has correct x-coordinate', function() {
			expect(this.point.x).toEqual(2);
		});

		it('has correct y-coordinate', function() {
			expect(this.point.y).toEqual(3);
		});
	});

});
