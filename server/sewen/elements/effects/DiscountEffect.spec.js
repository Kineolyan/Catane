import DiscountEffect from 'server/sewen/elements/effects/DiscountEffect';

import { Card } from 'server/sewen/elements/cards/Card';
import { Resources } from 'server/sewen/elements/cards/cards';
import { Side } from 'server/sewen/game/players/SewenPlayer';
import { DEFAULT_COST } from 'server/sewen/elements/cards/CostMixins';

function makeCard(resourceType, direction, cost, definition = {}) {
	const effect = new DiscountEffect(resourceType, direction, cost);
	const card = new Card('a-card', definition);

	return effect.mixWith(card);
}

describe('DiscountEffect', function() {
	describe('initialization', function() {
		beforeEach(function() {
			this.card = makeCard('raw', 'left', 3);
		});

		it('saves impacted resources', function() {
			expect(Array.from(this.card._resources.values()))
				.toHaveMembers([Resources.PIERRE, Resources.MINERAI, Resources.BOIS, Resources.ARGILE]);
		});

		it('detects the side', function() {
			expect(this.card._direction).toEqual(Side.LEFT);
		});

		it('reads the cost for resources', function() {
			expect(this.card._cost).toEqual(3);
		})
	});

	describe('#getCostFor', function() {
		beforeEach(function() {
			this.card = makeCard('raw', 'left', 3);
		});

		it('returns the defined cost for considered resources', function() {
			[Resources.ARGILE, Resources.PIERRE, Resources.BOIS, Resources.MINERAI].forEach(resource => {
				expect(this.card.getCostFor(resource, Side.LEFT)).toEqual(3);
			});
		});

		it('returns the default cost for the other side', function() {
			[Resources.ARGILE, Resources.PIERRE, Resources.BOIS, Resources.MINERAI].forEach(resource => {
				expect(this.card.getCostFor(resource, Side.RIGHT)).toEqual(DEFAULT_COST);
			});
		});

		it('returns the default cost for other resources', function() {
			[Resources.VERRE, Resources.TISSU, Resources.PAPIER].forEach(resource => {
				expect(this.card.getCostFor(resource, Side.LEFT)).toEqual(DEFAULT_COST);
			});
		});
	});

	it('is configurable with raw resources', function() {
		this.card = makeCard('raw', 'left', 3);
		expect(Array.from(this.card._resources.values()))
			.toHaveMembers([Resources.PIERRE, Resources.MINERAI, Resources.BOIS, Resources.ARGILE]);
	});

	it('is configurable with complex resources', function() {
		this.card = makeCard('processed', 'left', 3);
		expect(Array.from(this.card._resources.values()))
			.toHaveMembers([Resources.VERRE, Resources.TISSU, Resources.PAPIER]);
	});

	it('is configurable for left side', function() {
		this.card = makeCard('raw', 'left', 3);
		expect(this.card.getCostFor(Resources.MINERAI, Side.LEFT)).toEqual(3);
		expect(this.card.getCostFor(Resources.PAPIER, Side.RIGHT)).toEqual(DEFAULT_COST);
	});

	it('is configurable for right side', function() {
		this.card = makeCard('raw', 'right', 3);
		expect(this.card.getCostFor(Resources.MINERAI, Side.RIGHT)).toEqual(3);
		expect(this.card.getCostFor(Resources.PAPIER, Side.LEFT)).toEqual(DEFAULT_COST);
	});

	it('is configurable for both sides', function() {
		this.card = makeCard('raw', 'both', 3);
		expect(this.card.getCostFor(Resources.MINERAI, Side.LEFT)).toEqual(3);
		expect(this.card.getCostFor(Resources.MINERAI, Side.RIGHT)).toEqual(3);
		expect(this.card.getCostFor(Resources.PAPIER, Side.RIGHT)).toEqual(DEFAULT_COST);
	});
});
