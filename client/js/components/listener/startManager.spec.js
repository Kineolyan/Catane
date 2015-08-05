import tests from 'client/js/components/libs/test';
import StartManager from 'client/js/components/listener/startManager';
import Globals from 'client/js/components/libs/globals';
import { PlayersBinding } from 'client/js/components/common/players';

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
			var playersBinding = this.binding.get('players');
			expect(playersBinding).toHaveSize(2);
			var helper = new PlayersBinding(playersBinding);

			expect(helper.getPlayer(1).get('name')).toEqual('bob');
			expect(helper.getPlayer(1).get('me')).toEqual(true);

			expect(helper.getPlayer(2).get('name')).toEqual('tom');
		});

		it('resets list if updated again', function() {
			this.mgr.updatePlayerList({ players: [{ id: 1, name: 'bob' }] });
			expect(this.binding.get('players')).toHaveSize(1);
		});
	});

	it('update one player\'s nickname', function() {
		expect(() => {
			this.mgr.updatePlayerNickname({ player: { id: 1, name: 'tom' } });
		}).toChangeFromTo(() => {
			return (new PlayersBinding(this.binding.get('players'))).getPlayer(1).get('name');
		}, 'Bob', 'tom');
	});

	describe('on game start', function() {
		beforeEach(function() {
			this.mgr.updatePlayerList({ players: [
				{ id: 1, name: 'Oliv' },
				{ id: 2, name: 'Pierrick' },
				{ id: 3, name: 'Tom' }
			] });

			// start the game
			this.mgr.startGame({
				board: {
					tiles: [
						{ x: 0, y: 0, resource: 'tuile', diceValue: 1 }
					], cities: [
						{ x: 0, y: 1 },
						{ x: 1, y: 0 },
						{ x: 1, y: -1 }
					], paths: [
						{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } },
						{ from: { x: 1, y: -1 }, to: { x: 1, y: 0 } }
					]
				}, players: [2, 3, 1]
			});
		});

		it('reorders players', function() {
			var order = this.binding.get('players').map(player => player.get('id'));
			expect(order.toJS()).toEqual([2, 3, 1]);
		});

		it('assigns a color to each player', function() {
			var colors = this.binding.get('players').map(player => player.get('color'));
			expect(colors.toJS()).toEqual(Globals.interface.player.colors.slice(0, 3));
		});

		it('creates the board from data', function() {
			expect(this.binding.get('game.board').toJS()).toBeDefined();
		});

		it('moves to prepare phase', function() {
			expect(this.binding.get('step')).toEqual(Globals.step.prepare);
		});
	});

	describe('when leaving the game', function() {
		it('removes all others players', function() {
			this.binding.set('start.gameChosen', Immutable.fromJS({ id: 1 }));
			this.mgr.updatePlayerList({ players: [{ id: 1, name: 'bob' }, { id: 2, name: 'tom' }] });
			this.mgr.quitGame();

			expect(this.binding.get('players')).toHaveSize(1);
		});

		it('disables the current gameChosen', function() {
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