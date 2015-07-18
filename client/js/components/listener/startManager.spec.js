import tests from 'client/js/components/libs/test';
import StartManager from 'client/js/components/listener/startManager';
import Globals from 'client/js/components/libs/globals';

import Immutable from 'immutable';

describe('StartManager', function() {
	beforeEach(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();

		this.mgr = new StartManager(ctx);
	});

	describe('update player list', function() {
		beforeEach(function() {
			this.mgr.updatePlayerList({ players: [{ id: 1, name: 'bob' }, { id: 2, name: 'tom' }] });
		});

		it('has all the players', function() {
			expect(this.binding.get('players').toJS().getMap().size).toEqual(2);
		});

		it('reset if updated again', function() {
			this.mgr.updatePlayerList({ players: [{ id: 1, name: 'bob' }] });
			expect(this.binding.get('players').toJS().getMap().size).toEqual(1);
		});
	});

	it('update one player\'s nickname', function() {
		expect(this.binding.get('players').toJS().getMe().name).toEqual('Bob');

		this.mgr.updatePlayerNickname({ player: { id: 1, name: 'tom' } });

		expect(this.binding.get('players').toJS().getMe().name).toEqual('tom');
	});

	it('start the game', function() {
		this.mgr.startGame({ board: {} });

		expect(this.binding.get('step')).toEqual(Globals.step.prepare);
		expect(this.binding.get('game.board').toJS()).toBeDefined();
	});

	describe('leave the current game', function() {

		it('remove all the others players', function() {
			this.binding.set('start.gameChosen', Immutable.fromJS({ id: 1 }));
			this.mgr.updatePlayerList({ players: [{ id: 1, name: 'bob' }, { id: 2, name: 'tom' }] });
			this.mgr.quitGame();

			expect(this.binding.get('players').toJS().getMap().size).toEqual(1);
		});

		it('disable the current gameChosen', function() {
			expect(this.binding.get('start.gameChosen').toJS()).toEqual({});
		});
	});

	it('create some game', function() {
		this.mgr.gameCreate({ game: { id: 2 } });
		expect(this.binding.get('start.gameChosen').toJS()).toEqual({ id: 2 });
	});

	it('update the list of available games', function() {
		this.mgr.updateGameList({ games: [{ id: 2 }, { id: 3 }] });
		expect(this.binding.get('start.games').toJS()).toEqual([{ id: 2 }, { id: 3 }]);
	});

	it('can join a game', function() {
		this.mgr.updateGameList({ games: [{ id: 2 }, { id: 3 }] });
		this.mgr.gameJoin({ id: 2 });
		expect(this.binding.get('start.gameChosen').toJS()).toEqual({ id: 2 });

	});
});