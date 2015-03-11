import { RandomResources } from './resources';

function collectResources(generator) {
	var resources = [];
	for (let res of generator) {
		resources.push(res);
	}

	return resources;
}

describe('Generators of resources', function() {

	describe('RandomResources', function() {
		it('always contains the desert', function() {
			var resources = collectResources(new RandomResources(1));
			expect(resources).toContain('desert');

			resources = collectResources(new RandomResources(7));
			expect(resources).toContain('desert');

			resources = collectResources(new RandomResources(19));
			expect(resources).toContain('desert');
		});

		describe('generates classic catane map', function() {
			beforeEach(function() {
				this.resources = {};
				var generator = new RandomResources(19);
				for (let res of generator) {
					this.resources[res] = (this.resources[res] || 0) + 1;
				}
			});

			it('has 1 desert', function() {
				expect(this.resources.desert).toBe(1);
			});

			it('has 4 moutons', function() {
				expect(this.resources.mouton).toBe(4);
			});

			it('has 4 bois', function() {
				expect(this.resources.bois).toBe(4);
			});

			it('has 4 bles', function() {
				expect(this.resources.ble).toBe(4);
			});

			it('has 3 tuiles', function() {
				expect(this.resources.tuile).toBe(3);
			});

			it('has 3 cailloux', function() {
				expect(this.resources.caillou).toBe(3);
			});
		});
	});

});