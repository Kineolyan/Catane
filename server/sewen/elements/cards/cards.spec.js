import _ from 'lodash';

import { Cards, Resources } from 'server/sewen/elements/cards';

describe('cards', function () {
	it('has no card with multiple resources and forks', function () {
		const invalidCards = _.chain(Cards)
			.filter(card => {
				const gains = Object.keys(card);
				return gains.length > 1 || Array.some(gains, gain => !Resources.isValue(gain));
			}).map((card, name) => name)
			.value();
		expect(invalidCards).toBeEmpty();
	});
});