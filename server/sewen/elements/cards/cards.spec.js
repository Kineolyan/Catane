import _ from 'lodash';

import {
	Cards,
	Resources,
	CardType,
	ScienceType,
	RawResourcesCards,
	ProcessedResourcesCards,
	ScienceOffices,
	WarOffices,
	CityBuildings,
	TradeCenters,
	Guildes
} from 'server/sewen/elements/cards/cards';

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

	it('has a cost for every card', function() {
		expect(_.every(Cards, card => card.cost !== undefined)).toBe(true);
	});

	it('has gains for every card', function() {
		expect(_.every(Cards, card => card.gains !== undefined)).toBe(true);
	});

	[
		[RawResourcesCards, CardType.MATIERE],
		[ProcessedResourcesCards, CardType.FABRIQUE],
		[ScienceOffices, CardType.SCIENCE],
		[WarOffices, CardType.MILITAIRE],
		[CityBuildings, CardType.CIVIL],
		[TradeCenters, CardType.COMMERCE]
	].forEach(([cards, type]) => {
		it(`has all cards of type ${type} with the correct type`, function () {
			_.forEach(cards, card => expect(CardType[card.type]).toEqual(CardType[type]));
		});
	});

	describe('with gains', function() {
		const cardWithGains = _.filter(Cards, card => !_.isEmpty(card.gains));

		it('has all gains as defined resources', function() {
			_.forEach(cardWithGains, card => {
				_(card.gains).keys()
					.forEach(gain => {
						expect(Resources.decompose(gain).every(r => Resources.isValue(r)));
					}).run();
			});
		});
	});

	describe('with requirement', function () {
		function onRequire(card, action) {
			if (_.isArray(card.requires)) {
				_.forEach(card.requires, action);
			} else {
				action(card.requires);
			}
		}

		const cardsWithRequire = _.filter(Cards, card => card.requires !== undefined);

		it('has all requirement as cards', function () {
			const cardNames = Object.keys(Cards);
			_.forEach(cardsWithRequire, card => {
				onRequire(card, requirement => expect(cardNames).toContain(requirement));
			});
		});

		it('has all requirements defined at most at the current age', function () {
			_.forEach(cardsWithRequire, card => {
				const cardAges = card.quantity.map(q => q.age);
				onRequire(card, requirement => {
					const requirementAges = Cards[requirement].quantity.map(q => q.age);
					cardAges.every(age => requirementAges.some(rAge => rAge <= age));
				});
			});
		});
	});

	describe('about science', function () {
		it('has a sub-type for all', function () {
			_.forEach(ScienceOffices, card => {
				const subType = ScienceType[card.subtype];
				expect(subType).not.toBe(undefined);
			});
		});
	});
});

describe('Guildes', function() {
	it('defines 10 guildes', function() {
		expect(_.size(Guildes)).toEqual(10);
	});
});
