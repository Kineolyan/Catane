import _ from 'lodash';

import { Cards, Resources } from 'server/sewen/elements/cards/cards';

describe('cards', function () {
	it('has no card with multiple resources and forks', function () {
		const invalidCards = _.chain(Cards)
			.map((card, name) => [card, name])
			.filter(([card, ]) => {
				const gains = Object.keys(card.gains);
				return gains.length > 1 && Array.some(gains, gain => !Resources.isValue(gain));
			}).map(([, name]) => name)
			.value();
		expect(invalidCards).toBeEmpty();
	});
});