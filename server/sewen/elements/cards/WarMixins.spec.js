import { Card } from 'server/sewen/elements/cards/Card';
import getMixin, * as mixins from 'server/sewen/elements/cards/WarMixins';
import { Resources } from 'server/sewen/elements/cards/cards';

function makeCard(mixin, definition = {}) {
	const card = new Card('a-card', definition);
	return mixin.mixWith(card);
}

describe('War mixins', function() {
	describe('EmptyMixin', function () {
		beforeEach(function () {
			this.card = makeCard(mixins.EmptyMixin);
		});
	
		describe('#getWarPrice', function () {
			it('returns 0', function () {
				expect(this.card.getWarPrice()).toBe(0);
			});
		});
	});
	
	describe('WarMixin', function () {
		beforeEach(function () {
			this.card = makeCard(mixins.WarMixin, { gains: { [Resources.ARME]: 3 } });
		});
	
		describe('#getWarPrice', function () {
			it('returns the quantity of gained weapons', function () {
				expect(this.card.getWarPrice()).toBe(3);
			});
		});
	});
	
	describe('getMixin', function () {
		it('uses WarMixin when weapons are gained', function () {
			expect(getMixin({ gains: { [Resources.ARME]: 2 } })).toEqual(mixins.WarMixin);
		});
	
		it('uses EmptpMixin if there are no weapons', function () {
			expect(getMixin({
				gains: { [Resources.MINERAI]: 3 },
				costs: { [Resources.ARME]: 5 }
			})).toEqual(mixins.EmptyMixin);
		});
	});
});