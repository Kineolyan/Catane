import _ from 'lodash';

import { Cards, Resources } from 'server/sewen/elements/cards/cards';

describe('cards', function () {
	it('has no card with multiple resources and forks', function () {
		const invalidCards = _.chain(Cards)
			.map((card, name) => [card, name])
			.filter(([card, ]) => {
				const gains = Object.keys(card.gains || {});
				return gains.length > 1 && Array.some(gains, gain => !Resources.isValue(gain));
			}).map(([, name]) => name)
			.value();
		expect(invalidCards).toBeEmpty();
	});
});

/*
TODO tests:
check that every requirement exists
check that every requirement is from the previous age (-1)
check that every element of a type has the correct type
every card has a cost
every card has gains
 */