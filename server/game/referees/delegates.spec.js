import { DropResourcesDelegate } from './delegates.js';

import * as starter from 'server/game/games/game-spec.starter.js';

describe('DropResourcesDelegate', function() {
	beforeEach(function() {
		this.p1 = starter.createLocalPlayer().player;
		this.p2 = starter.createLocalPlayer().player;

		this.referee = {
			players: [this.p1, this.p2]
		};
	});

	describe('#constructor', function() {
		it('references referee', function() {
			var delegate = new DropResourcesDelegate(this.referee);
			expect(delegate.referee).toEqual(this.referee);
		});
	});

	describe('#countResources', function() {
		beforeEach(function() {
			this.delegate = new DropResourcesDelegate(this.referee);
		});

		it('counts with resource objects', function() {
			expect(this.delegate.countResources({ ble: 3 })).toEqual(3);
			expect(this.delegate.countResources({ ble: 3, bois: 2, tuile: 1 })).toEqual(6);
			expect(this.delegate.countResources({})).toEqual(0);
		});
	});

	describe('#dropResources', function() {
		beforeEach(function() {
			this.p1.receiveResources({ ble: 5, bois: 4, tuile: 3 }); // 6 to drop
			this.delegate = new DropResourcesDelegate(this.referee);
		});

		it('removes the resources from the player', function() {
			this.delegate.dropResources(this.p1, { ble: 3, bois: 3 });
			expect(this.p1.resources).toEqual({ ble: 2, bois: 1, tuile: 3 });
		});

		it('gives the number of remaining', function() {
			var remaining = this.delegate.dropResources(this.p1, { ble: 2, bois: 2 });
			expect(remaining).toEqual(2);

			remaining = this.delegate.dropResources(this.p1, { ble: 1, bois: 1 });
			expect(remaining).toEqual(0);
		});
	});

	describe('#getRemainingList', function() {
		beforeEach(function() {
			this.p1.receiveResources({ ble: 5, bois: 4, tuile: 3 }); // 6 to drop
			this.p2.receiveResources({ ble: 4, bois: 3, tuile: 2 }); // 4 to drop
			this.delegate = new DropResourcesDelegate(this.referee);
		});

		it('gives the count of remaining resources per player', function() {
			var expected = {};
			expected[this.p1.id] = 6;
			expected[this.p2.id] = 4;
			expect(this.delegate.remainingList).toEqual(expected);
		});

		it('excludes players without resources to drop', function() {
			this.delegate.dropResources(this.p1, { ble: 5, bois: 1 });
			var expected = {};
			expected[this.p2.id] = 4;
			expect(this.delegate.remainingList).toEqual(expected);
		});
	});

	describe('#checkTurn', function() {
		beforeEach(function() {
			this.delegate = new DropResourcesDelegate(this.referee);
		});

		['checkTurn'].forEach(method => {
			it(`throws with a warning to the user when calling #${method}`, function() {
				expect(() => {
					this.delegate[method]();
				}).toThrowError(/drop.* resources/i);
			});
		});
	});

	describe('dropping', function() {
		describe('without resources to drop', function() {
			beforeEach(function() {
				for (let player of this.referee.players) {
					player.receiveResources({ ble: 4, bois: 3 });
				}
				this.delegate = new DropResourcesDelegate(this.referee);
			});

			it('has no resources to drop', function() {
				expect(this.delegate.allResourcesDropped()).toBe(true);
			});

			it('fails on drop resources', function() {
				expect(() => {
					this.delegate.dropResources(this.p1, { ble: 2 });
				}).toThrowError();
			});
		});

		describe('with resources to drop', function() {
			beforeEach(function() {
				this.p1.receiveResources({ ble: 5, bois: 4, tuile: 3 }); // 6 to drop
				this.p2.receiveResources({ ble: 4, bois: 3, tuile: 2 }); // 4 to drop

				this.delegate = new DropResourcesDelegate(this.referee);
			});

			it('lets drop all resources in a single call', function() {
				this.delegate.dropResources(this.p1, { ble: 3, bois: 3 });
				this.delegate.dropResources(this.p2, { ble: 4 });

				expect(this.delegate.allResourcesDropped()).toBe(true);
			});

			it('allows to drop in multiples calls', function() {
				this.delegate.dropResources(this.p1, { ble: 3 });
				this.delegate.dropResources(this.p1, { bois: 3 });
				this.delegate.dropResources(this.p2, { ble: 4 });

				expect(this.delegate.allResourcesDropped()).toBe(true);
			});

			it('prevents to drop unexisting resources', function() {
				expect(() => {
					this.delegate.dropResources(this.p1, { ble: 6 });
				}).toThrowError(/not enough resources/i);
			});

			it('prevents to drop too many resources', function() {
				expect(() => {
					this.delegate.dropResources(this.p1, { ble: 5, bois: 4 });
				}).toThrowError(/too many resources/i);
			});
		});
	});
});