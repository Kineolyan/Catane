import ScoreCard from 'server/elements/cards/score';

describe('ScoreCard', function() {
	describe('#constructor', function() {
		it('sets the id of the card', function() {
			const card = new ScoreCard(12);
			expect(card.id).toEqual(12);
		});

		it('creates a card for score 1 by default', function() {
			const card = new ScoreCard(1);
			expect(card.value).toEqual(1);
		});

		it('creates card for any score', function() {
			const card = new ScoreCard(2, 4);
			expect(card.value).toEqual(4);
		});
	});

	describe('#applyOn', function() {
		beforeEach(function() {
			this.player = jasmine.createSpyObj('player', ['winPoints', 'emit']);
			this.player.game = { players: {} };
			this.card = new ScoreCard(75);
			this.card.applyOn({ player: this.player });
		});

		it('adds 1 point to the player', function() {
			expect(this.player.winPoints).toHaveBeenCalledWith(1);
		})
	});
});