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

	describe('#hashCode', function() {
		it('identifies clearly a location', function() {
			expect(new Location(3, 2).hashCode()).toEqual(203);
		});
	});

	describe('#shift', function() {
		it('creates a new shift location', function() {
			var point = new Location(2, 3);
			var shiftedPoint = point.shift(4, 5);
			expect(shiftedPoint).not.toBe(point);
			expect(shiftedPoint.x).toEqual(6);
			expect(shiftedPoint.y).toEqual(8);
		});
	});

	describe('#toJson', function() {
		it('returns a object representing the location', function() {
			var point = new Location(1,2);
			expect(point.toJson()).toEqual({ x: 1, y: 2 });
		});
	});

});
