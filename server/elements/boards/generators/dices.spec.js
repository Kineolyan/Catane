import * as dists from './dices.js';

describe('Dice tag generators', function() {
	describe('catane generator', function() {
		beforeEach(function() {
			this.generator = dists.catane();
		});

		it('provides all first values in order', function() {
			var values = [];
			for (let i = 0; i < 18; i += 1) { values.push(this.generator.next().value); }

			expect(values).toEqual([ 11, 3, 6, 5, 4, 9, 10, 8, 4, 11, 12, 9, 10, 8, 3, 6, 2, 5 ]);
		});

		it('provides more numbers after distribution', function() {
			for (let i = 0; i < 30; i += 1) {
				let value = this.generator.next();
				expect(value).toBeDefined();
				expect(value.value).toBeAnInteger();
			}
		});
	});
});