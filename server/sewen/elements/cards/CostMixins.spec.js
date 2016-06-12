import getMixin, * as mixins from 'server/sewen/elements/cards/CostMixins';
import { Card } from 'server/sewen/elements/cards/Card';
import { Side } from 'server/sewen/game/players/SewenPlayer';

function makeCard(mixin, definition = {}) {
	const card = new Card('a-card', definition);
	return mixin.mixWith(card);
}

describe('Cost mixins', function() {
	describe('DefaultMixin', function () {
		beforeEach(function () {
			this.card = makeCard(mixins.DefaultMixin);
		});

		describe('#getCostFor', function () {
			it('returns 2', function () {
				expect(this.card.getCostFor(undefined, Side.LEFT)).toBe(2);
			});
		});
	});

	describe('getMixin', function () {
		it('always use a DefaultMixin', function () {
			expect(getMixin()).toEqual(mixins.DefaultMixin);
		});
	});
});