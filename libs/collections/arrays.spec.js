import * as util from './arrays.js';

describe('Array utils', function() {

	describe('#shuffle', function() {
		describe('with arrays', function() {
			beforeEach(function() {
				this.values = [ 1, 2, 3, 4, 5 ];
				this.shuffledValues = util.shuffle(this.values);
			});

			it('contains the same values', function() {
				expect(this.shuffledValues).toHaveMembers(this.values);
			});
		});

		describe('with sets', function() {
			beforeEach(function() {
				this.set = new Set();
				for (let i = 1; i <= 5; i += 1) { this.set.add(1); }
				this.shuffledValues = util.shuffle(this.set);
			});

			it('contains all the set values', function() {
				expect(this.set.size).toEqual(this.shuffledValues.length);
				this.set.forEach(value => expect(this.shuffledValues).toContain(value));
			});
		});
	});
});