import { Card, makeCard } from 'server/sewen/elements/cards/Card';
import { Resources, CardType } from 'server/sewen/elements/cards/cards';

describe('Card', function () {
	beforeEach(function () {
		this.card = new Card('a-card', {
			type: CardType.FABRIQUE,
			cost: { [Resources.POINT]: 2 },
			gains: { [Resources.VERRE]: 1 },
			quantity: [
				{ age: 1, range: [3, 6] },
				{ age: 3, range: [4, 5] }
			]
		});
	});

	it('gets the name of the card', function () {
		expect(this.card.name).toEqual('a-card');
	});

	it('returns ages on which the card can be used', function () {
		expect(this.card.ages).toHaveMembers([1, 3]);
	});

	it('gets the costs of the card', function() {
		expect(this.card.cost).toEqual({ [Resources.POINT]: 2 });
	});

	it('gets the gains of the card', function() {
		expect(this.card.gains).toEqual({ [Resources.VERRE]: 1 });
	});

	describe('#getCountFor', function () {
		it('returns the count for players', function () {
			expect(this.card.getCountFor(3, 1)).toEqual(1);
			expect(this.card.getCountFor(5, 1)).toEqual(1);
			expect(this.card.getCountFor(7, 1)).toEqual(2);

			expect(this.card.getCountFor(7, 3)).toEqual(2);
		});

		it('returns 0 if there are not enough players for this card', function () {
			expect(this.card.getCountFor(3, 3)).toEqual(0);
		});

		it('returns 0 if the age is not represented', function () {
			expect(this.card.getCountFor(7, 2)).toEqual(0);
		});
	});
});

describe('makeCard', function () {
	beforeEach(function () {
		this.card = makeCard('a-card', {
			type: CardType.FABRIQUE,
			cost: { [Resources.POINT]: 2 },
			gains: { [Resources.VERRE]: 1 },
			quantity: [
				{ age: 1, range: [3, 6] },
				{ age: 3, range: [4, 5] }
			]
		});
	});

	it('has all required methods', function () {
		['canProvide', 'getCostFor', 'getWarPrice'].forEach(method => {
			expect(this.card[method]).toBeA(Function);
		});
	});
});
