import * as maps from './maps.js';

describe('maps module', function() {

	describe('#entries', function() {
		it('iterates over every property', function() {
			var obj = {
				a: 1,
				b: 2,
				c: 3
			};
			var count = 0;
			for (let [key, value] of maps.entries(obj)) {
				switch (key) {
					case 'a':
						expect(value).toBe(1);
						break;
					case 'b':
						expect(value).toBe(2);
						break;
					case 'c':
						expect(value).toBe(3);
						break;
					default:
						expect('unexpected item').toBe(false);
				}
				count += 1;
			}
			expect(count).toBe(3);
		});
	});

	it('supports empty maps', function() {
		var count = 0;
		for (let [, value] of maps.entries({})) {
			count += value;
		}
		expect(count).toEqual(0);
	});

});