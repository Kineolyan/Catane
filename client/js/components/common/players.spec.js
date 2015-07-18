import 'client/js/components/libs/test';

import Players from 'client/js/components/common/players';

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