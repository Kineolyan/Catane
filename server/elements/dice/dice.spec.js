import Dice from './dice';

describe('Dice', function() {

	describe('with 4 faces', function() {
		beforeEach(function() {
			this.dice = new Dice(4);
		});

		it('has 4 faces', function() {
			expect(this.dice.nbOfFaces).toEqual(4);
		});

		it('generates numbers in {1, 2, 3, 4}', function() {
			expect(this.dice.roll()).toBeIn([1, 2, 3, 4]);
		});
	});
});