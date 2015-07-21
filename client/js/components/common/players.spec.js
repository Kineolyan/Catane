import tests from 'client/js/components/libs/test';

import Players from 'client/js/components/common/players';
import { PlayersBinding } from 'client/js/components/common/players';

describe('The player helper', function() {

	beforeEach(function() {
		Players.deleteAll();
		this.player = Players.createPlayer(1, 'bob', 'green');
	});

	describe('should create a player', function() {

		it('should be able to create a player', function() {
			expect(this.player).not.toBeFalsy();
		});

		it('#color', function() {
			expect(this.player.color).toEqual('green');
		});

		it('#name', function() {
			expect(this.player.name).toEqual('bob');
		});

		it('#id', function() {
			expect(this.player.id).toEqual(1);
		});

		it('and can get \'me\' ', function() {

			this.other = Players.createPlayer(2, 'jean', 'yellow');
			Players.myId = 1;
			expect(Players.getMe()).toBe(this.player);
		});
	});

	it('delete the others players', function() {
		this.other = Players.createPlayer(2, 'jean', 'yellow');
		Players.myId = 1;
		Players.deleteOthers();
		expect(Players.getMap().size).toEqual(1);
	});

	it('can create from JS', function() {
		var players = Players.createFromJS({ id: 2, name: 'jean', color: 'red' });
		Players.myId = 2;
		expect(Players.getMe()).toBe(players);
	});

	it('can be exported to JS', function() {
		expect(JSON.stringify(Players.toJS())).toEqual(JSON.stringify([this.player]));
	});

});

describe('PlayersBinding', function() {
	beforeEach(function() {
		var ctx = tests.getCtx({ players: [] });
		this.binding = ctx.getBinding().get('players');
		this.helper = new PlayersBinding(this.binding);
	});

	describe('#getPlayer', function() {
		beforeEach(function() {
			['a', 'b', 'c'].forEach((name, i) => this.helper.setPlayer(i + 1, name));
		});

		it('gets the correct item', function() {
			var player = this.helper.getPlayer(2);
			expect(player.get('name')).toEqual('b');
		});

		it('gets null on unexisting item', function() {
			var player = this.helper.getPlayer(10);
			expect(player).toEqual(null);
		});
	});

	describe('#setPlayer', function() {
		describe('on initial set', function() {
			it('supports complete player definition', function() {
				this.helper.setPlayer(1, 'Olivier', 'green', 2);

				var player = this.helper.binding.get(0).toJS();
				expect(player).toEqual({ id: 1, name: 'Olivier', color: 'green', nbOfCards: 2 });
			});

			it('supports partial player definition', function() {
				this.helper.setPlayer(1, 'Olivier');

				var player = this.helper.binding.get(0).toJS();
				expect(player).toEqual({ id: 1, name: 'Olivier', color: undefined, nbOfCards: 0 });
			});
		});

		describe('with existing element', function() {
			beforeEach(function() {
				this.helper.setPlayer(1, 'Olivier', 'green', 2);
				this.helper.setPlayer(1, 'Olivier', 'red', 2);
			});

			it('udpates the existing item', function() {
				var player = this.helper.binding.get(0).toJS();
				expect(player).toEqual({ id: 1, name: 'Olivier', color: 'red', nbOfCards: 2 });
			});
		});
	});

	describe('#setIPlayer', function() {
		describe('on initial set', function() {
			it('supports complete player definition', function() {
				this.helper.setIPlayer(1, 'Olivier', 'green', 2);

				var player = this.helper.binding.get(0).toJS();
				expect(player).toEqual({ id: 1, name: 'Olivier', color: 'green', nbOfCards: 2, me: true });
			});

			it('supports partial player definition', function() {
				this.helper.setIPlayer(1, 'Olivier');

				var player = this.helper.binding.get(0).toJS();
				expect(player).toEqual({ id: 1, name: 'Olivier', color: undefined, nbOfCards: 0, me: true });
			});
		});

		describe('with existing element', function() {
			beforeEach(function() {
				this.helper.setIPlayer(1, 'Olivier', 'green', 2);
				this.helper.setIPlayer(1, 'Olivier', 'red', 2);
			});

			it('udpates the existing item', function() {
				var player = this.helper.binding.get(0).toJS();
				expect(player).toEqual({ id: 1, name: 'Olivier', color: 'red', nbOfCards: 2, me: true });
			});
		});
	});

	describe('#updatePlayer', function() {
		beforeEach(function() {
			this.helper.setPlayer(2, 'Olivier', 'red', 2);
			this.helper.setIPlayer(1, 'Tom', 'green', 1);
		});

		it('updates only wanted values', function() {
			this.helper.updatePlayer(1, { nbOfCards: 3, name: 'Me' });

			var player = this.helper.getPlayer(1).toJS();
			expect(player).toEqual({ id: 1, name: 'Me', color: 'green', nbOfCards: 3, me: true });
		});

		it('throws if player does not exist', function() {
			expect(() => {
				this.helper.updatePlayer(45, { nbOfCards: 3, name: 'Me' });
			}).toThrowError();
		});
	});

	describe('#getMe', function() {
		beforeEach(function() {
			this.helper.setPlayer(2, 'Olivier', 'red', 2);
			this.helper.setIPlayer(1, 'Tom', 'green', 1);
		});

		it('gets the correct player', function() {
			var me = this.helper.getMe();
			expect(me.get('name')).toEqual('Tom');
		});
	});

	describe('#deleteOthers', function() {
		beforeEach(function() {
			this.helper.setPlayer(2, 'Olivier', 'red', 2);
			this.helper.setIPlayer(1, 'Tom', 'green', 1);

			this.helper.deleteOthers();
		});

		it('clears the list', function() {
			expect(this.helper.binding).toHaveSize(1);
			expect(this.helper.binding.get(0).get('id')).toEqual(1);
		});
	});

	describe('#isMe', function() {
		beforeEach(function() {
			this.helper.setPlayer(2, 'Olivier', 'red', 2);
			this.helper.setIPlayer(1, 'Tom', 'green', 1);
		});

		it('identifies correctly me', function() {
			expect(PlayersBinding.isMe(this.helper.getPlayer(1))).toBe(true);
		});

		it('detects wrong players', function() {
			expect(PlayersBinding.isMe(this.helper.getPlayer(2))).toBe(false);
		});
	});
});