import { Card } from 'server/sewen/elements/cards/Card';
import getMixin, * as mixins from 'server/sewen/elements/cards/ResourceMixins';

function makeCard(definition) {
	return new Card('a-card', definition);
}

fdescribe('EmptyMixin', function () {
	beforeEach(function () {
		this.card = mixins.EmptyMixin.includeTo(makeCard({});
	});

	describe('#canProvide', function () {
		it('returns false to anything', function() {
			expect(this.card.canProvide()).toBe(false);
		});
	});

	describe('#getCostFor', function () {
		it('throws when called', function() {
			expect(() => this.card.getCostFor()).toThrowError(/cannot provide resources/);
		});
	});
});