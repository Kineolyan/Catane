import tests from 'client/js/components/libs/test';
import StartManager from 'client/js/components/listener/startManager';
import Globals from 'client/js/components/libs/globals';
import { PlayersBinding } from 'client/js/components/common/players';
import { MockSocketIO } from 'libs/mocks/sockets';
import { Socket, Channel } from 'client/js/components/libs/socket';

import Immutable from 'immutable';

describe('StartManager', function() {
	beforeEach(function() {
		var ctx = tests.getCtx();
		this.binding = ctx.getBinding();

		this.socket = new MockSocketIO();
		this.mgr = new StartManager(new Socket(this.socket), ctx);
	});

	describe('#setName', function() {
		beforeEach(function() {
			this.mgr.setName('Oliv');
		});

		it('sends a message on channel ' + Channel.playerNickname, function() {
			expect(this.socket.messages(Channel.playerNickname)).toHaveLength(1);
		});

		it('sends the new name for the player', function() {
			var message = this.socket.lastMessage(Channel.playerNickname);
			expect(message).toEqual('Oliv');
		});
	});

	describe('#createGame', function() {
		beforeEach(function() {
			this.mgr.createGame();
		});

		it('sends an emtpy message on channel ' + Channel.gameCreate, function() {
			expect(this.socket.messages(Channel.gameCreate)).toHaveLength(1);
		});
	});

	describe('#askGameList', function() {
		beforeEach(function() {
			this.mgr.askGameList();
		});

		it('sends an emtpy message on channel ' + Channel.gameList, function() {
			expect(this.socket.messages(Channel.gameList)).toHaveLength(1);
		});
	});

	describe('#joinGame', function() {
		beforeEach(function() {
			this.mgr.joinGame(4213);
		});

		it('sends a message on channel ' + Channel.gameJoin, function() {
			expect(this.socket.messages(Channel.gameJoin)).toHaveLength(1);
		});

		it('sends the id of the game to join', function() {
			var message = this.socket.lastMessage(Channel.gameJoin);
			expect(message).toEqual(4213);
		});
	});

	describe('#startGame', function() {
		beforeEach(function() {
			this.mgr.startGame(1342);
		});

		it('sends a message on channel ' + Channel.gameStart, function() {
			expect(this.socket.messages(Channel.gameStart)).toHaveLength(1);
		});

		it('sends the id of the game to start', function() {
			var message = this.socket.lastMessage(Channel.gameStart);
			expect(message).toEqual(1342);
		});
	});

	describe('#quitGame', function() {
		beforeEach(function() {
			this.mgr.quitGame();
		});

		it('sends a message on channel ' + Channel.gameQuit, function() {
			expect(this.socket.messages(Channel.gameQuit)).toHaveLength(1);
		});
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
			this.mgr.onGameStart({
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
			this.mgr.onGameQuit();

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