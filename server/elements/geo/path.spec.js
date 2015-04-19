import Path from './path';
import Location from './location';

describe('Path', function() {
	describe('constructor', function() {
		beforeEach(function() {
			this.path = new Path(new Location(1, 2), new Location(3, 4));
		});

		it('has correct coordinates', function() {
			var locations = [new Location(1, 2), new Location(3, 4)];

			expect(this.path.from).toBeIn(locations);
			expect(this.path.to).toBeIn(locations);
		});

		it('throws with identic locations', function() {
			expect( () => new Path(new Location(1, 3), new Location(1, 3)) ).toThrow();
		});
	});

	describe('#hashCode', function() {
		it('identifies a path', function() {
			var l1 = new Location(1, 2);
			var l2 = new Location(3, 4);
			var l3 = new Location(5, 6);

			expect(new Path(l1, l2).hashCode()).not.toEqual(new Path(l2, l3).hashCode());

		});

		describe('with path order', function() {
			var center = new Location(0, 0);
			[
				new Location(1, 0),
				new Location(1, 1),
				new Location(0, 1),
				new Location(-1, 1),
				new Location(-1, 0),
				new Location(-1, -1),
				new Location(0, -1),
				new Location(1, -1)
			].forEach(function(location) {
				it(`does not depend on the order for ${center.toString()} and ${location.toString()}`, function() {
					expect(new Path(center, location).hashCode()).toEqual(new Path(location, center).hashCode());
				});
			});
		});
	});

	describe('#toJson', function() {
		it('returns a object representing the path', function() {
			var path = new Path(new Location(1,2), new Location(3, 4));
			expect(path.toJson()).toEqual({ from: { x: 1, y: 2 }, to: { x: 3, y: 4 } });
		});
	});

});
