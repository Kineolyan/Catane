import ScoreCard from 'server/elements/cards/score';

describe('ScoreCard', function() {
	describe('#constructor', function() {
		it('creates a card for score 1 by default', function() {
			const card = new ScoreCard();
			expect(card.value).toEqual(1);
		});

		it('creates card for any score', function() {
			const card = new ScoreCard(4);
			expect(card.value).toEqual(4);
		});
	});

	describe('#applyOn', function() {
		beforeEach(function() {
			this.player = jasmine.createSpyObj('player', ['winPoints', 'emit']);
			this.player.game = { players: {} };
			this.card = new ScoreCard();
			this.card.applyOn({ player: this.player });
		});

		it('adds 1 point to the player', function() {
			expect(this.player.winPoints).toHaveBeenCalledWith(1);
		})
	});
});