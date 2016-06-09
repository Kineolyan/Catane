import { Card } from 'server/sewen/elements/cards/Card';
import getMixin, * as mixins from 'server/sewen/elements/cards/ResourceMixins';
import { Resources } from 'server/sewen/elements/cards/cards';

function makeCard(mixin, definition = {}) {
	const card = new Card('a-card', definition);
	return mixin.mixWith(card);
}

describe('EmptyMixin', function () {
	beforeEach(function () {
		this.card = makeCard(mixins.EmptyMixin);
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

describe('ResourcesMixin', function() {
	beforeEach(function() {
		this.card = makeCard(mixins.ResourcesMixin, {
			gains: { [Resources.MINERAI]: 2, [Resources.VERRE]: 1 }
		});
	});

	it('can provide one of the resources', function () {
		expect(this.card.canProvide({ [Resources.MINERAI]: 1 })).toEqual(true);
		expect(this.card.canProvide({ [Resources.VERRE]: 1 })).toEqual(true);
	});

	it('can provide both of the resources if allowed', function () {
		expect(this.card.canProvide({ [Resources.MINERAI]: 1, [Resources.VERRE]: 1 })).toEqual(true);
	});

	it('cannot provide another resource', function () {
		expect(this.card.canProvide({ [Resources.PAPIER]: 1 })).toEqual(false);
	});

	it('cannot provide if the order is not completely fulfilled', function () {
		expect(this.card.canProvide({ [Resources.MINERAI]: 2, [Resources.VERRE]: 2 })).toEqual(false);
	});

	it('cannot provide the resource if the cost is too high', function () {
		expect(this.card.canProvide({ [Resources.VERRE]: 3 })).toEqual(false);
	});
});

describe('MixedResourceMixin', function() {
	beforeEach(function() {
		this.card = makeCard(mixins.MixedResourceMixin, {
			gains: { [Resources.BOIS | Resources.ARGILE]: 1 }
		});
	});

	it('can provide one of the resources', function () {
		expect(this.card.canProvide({ [Resources.BOIS]: 1 })).toEqual(true);
		expect(this.card.canProvide({ [Resources.ARGILE]: 1 })).toEqual(true);
	});

	it('cannot provide another resource', function () {
		expect(this.card.canProvide({ [Resources.PAPIER]: 1 })).toEqual(false);
	});

	it('cannot provide if the order is not completely fulfilled', function () {
		expect(this.card.canProvide({ [Resources.PAPIER]: 1, [Resources.BOIS]: 1 })).toEqual(false);
	});

	it('cannot provide the resource if the total cost is too high', function () {
		expect(this.card.canProvide({ [Resources.BOIS]: 2 })).toEqual(false);
	});

	it('throws if there are more than one gain for mixed resources', function () {
		expect(() => makeCard(mixins.MixedResourceMixin, {
			gains: { [Resources.BOIS | Resources.ARGILE]: 1, [Resources.MINERAI]: 1 }
		})).toThrowError(/one gain/);
	});

	it('throws if the gain is higher than one', function () {
		expect(() => makeCard(mixins.MixedResourceMixin, {
			gains: { [Resources.BOIS | Resources.ARGILE]: 2 }
		})).toThrowError(/gain of 1/);
	});
});

describe('getMixin', function () {
	it('uses ResourcesMixin for simple resources', function () {
		expect(getMixin({ gains: { [Resources.PIERRE]: 1, [Resources.MINERAI]: 2 } })).toEqual(mixins.ResourcesMixin);
		expect(getMixin({ gains: { [Resources.PIERRE]: 1 } })).toEqual(mixins.ResourcesMixin);
	});

	it('uses MixedResourcesMixin for combined resources', function () {
		expect(getMixin({ gains: { [Resources.PIERRE | Resources.TISSU]: 1 } })).toEqual(mixins.MixedResourceMixin);
	});

	it('uses EmptpMixin if there are no resources', function () {
		expect(getMixin({})).toEqual(mixins.EmptyMixin);
	});
});