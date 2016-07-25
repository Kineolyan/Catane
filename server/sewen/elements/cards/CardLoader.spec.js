import _ from 'lodash';

import CardLoader from 'server/sewen/elements/cards/CardLoader';
import { Cards, Guildes } from 'server/sewen/elements/cards/cards';

describe('CardLoader', function() {
	beforeEach(function() {
		this.loader = new CardLoader();
	});

	describe('#loadCards', function() {
		beforeEach(function() {
			this.loader.loadCards();
		});

		it('loads all cards', function() {
			const cardNames = _.keys(this.loader._cards);
			expect(cardNames).toHaveLength(_.size(Cards) + _.size(Guildes));
			expect(cardNames).toEqual(jasmine.arrayContaining(_.keys(Cards)));
			expect(cardNames).toEqual(jasmine.arrayContaining(_.keys(Guildes)));
		});

		it('loads all guildes cards', function() {
			expect(this.loader._guildCards).toHaveLength(_.size(Guildes));
		});
	});

	describe('#generateDecks', function() {
		beforeEach(function() {
			this.loader.loadCards();
		});

		_.range(3, 8).forEach(function(nbPlayers) {
			describe(`for ${nbPlayers} players`, function() {
				beforeEach(function() {
					this.decks = this.loader.generateDecks(nbPlayers);
				});

				it('generates the deck sets for each age', function() {
					const ages = Object.keys(this.decks).map(v => parseInt(v, 10));
					expect(ages).toHaveLength(3);
					expect(ages).toHaveMembers([1, 2, 3]);
				});

				it('generates decks at each age for each player', function() {
					_.forEach(this.decks, decks => expect(decks).toHaveLength(nbPlayers));
				});

				it('has guild cards for age III', function() {
					const count = _.sum(this.decks[3], deck => _(deck).filter(card => card.isGuild()).size());
					expect(count).toEqual(nbPlayers + 2);
				});

				it('creates decks that all have 7 cards', function() {
					_(this.decks)
						.values()
						.flatten()
						.forEach(deck => expect(deck).toHaveLength(7))
						.run();
				});
			});
		});
	});
});
