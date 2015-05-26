import * as starter from './game-spec.starter.js';
import Location from 'server/elements/geo/location.js';
import Path from 'server/elements/geo/path.js';

describe('Game actions', function() {

	describe('#settleColony', function() {
		beforeEach(function() {
			this.env = starter.createLocalGame(2);
			this.env.start();
			this.env.randomPick();
			this.p = this.env.players[0];
			this.env.rollDice(this.p);
		});

		describe('with proper resources', function() {
			beforeEach(function() {
				var player = this.p.player;

				// Give enough resources to the player
				player.receiveResources({
					ble: 1, bois: 1, mouton: 1, tuile: 1
				});
				this.previousResources = JSON.parse(JSON.stringify(player.resources));
				this.pickedColony = this.env.game.settleColony(player, new Location(-1, 1));
			});

			it('allows acquiring the colony', function() {
				expect(this.pickedColony.location.hashCode()).toEqual(new Location(-1, 1).hashCode());
				expect(this.pickedColony.owner).toEqual(this.p.player);
			});

			it('removes the used resources from the player', function() {
				var newResources = this.p.player.resources;
				for( let r of [ 'ble', 'bois', 'mouton', 'tuile' ]) {
					expect(newResources[r]).toEqual(this.previousResources[r] - 1);
				}
			});
		});
	});

	describe('#buildRoad', function() {
		beforeEach(function() {
			this.env = starter.createLocalGame(2);
			this.env.start();
			this.env.randomPick();
			this.p = this.env.players[0];
			this.env.rollDice(this.p);
		});

		describe('with proper resources', function() {
			beforeEach(function() {
				var player = this.p.player;

				// Give enough resources to the player
				player.receiveResources({
					tuile: 2, bois: 2, mouton: 1, ble: 1
				});

				this.path = new Path(new Location(-1, 1), new Location(0, 1));
				this.env.game.settleColony(player, this.path.from);

				this.previousResources = JSON.parse(JSON.stringify(player.resources));
				this.builtRoad = this.env.game.buildRoad(player, this.path);
			});

			it('allows acquiring the colony', function() {
				expect(this.builtRoad.hashCode()).toEqual(this.path.hashCode());
				expect(this.builtRoad.owner).toEqual(this.p.player);
			});

			it('removes the used resources from the player', function() {
				var newResources = this.p.player.resources;
				for( let r of [ 'bois', 'tuile' ]) {
					expect(newResources[r]).toEqual(this.previousResources[r] - 1);
				}
			});
		});
	});

	describe('#buildCity', function() {
		beforeEach(function() {
			this.env = starter.createLocalGame(2);
			this.env.start();
			this.env.randomPick();
			this.p = this.env.players[0];
			this.env.rollDice(this.p);
		});

		describe('with proper resources', function() {
			beforeEach(function() {
				var player = this.p.player;

				// Give enough resources to the player
				player.receiveResources({
					ble: 3, bois: 1, mouton: 1, tuile: 1, caillou: 3
				});
				this.location = new Location(-1, 1);
				this.env.game.settleColony(player, this.location);

				this.previousResources = JSON.parse(JSON.stringify(player.resources));
				this.builtCity = this.env.game.buildCity(player, this.location);
			});

			it('allows acquiring the colony', function() {
				expect(this.builtCity.location.hashCode()).toEqual(this.location.hashCode());
				expect(this.builtCity.owner).toEqual(this.p.player);
			});

			it('removes the used resources from the player', function() {
				var newResources = this.p.player.resources;
				expect(newResources.ble).toEqual(this.previousResources.ble - 2);
				expect(newResources.caillou).toEqual(this.previousResources.caillou - 3);
			});
		});
	});

	describe('#rollDice', function() {
		beforeEach(function() {
			this.env = starter.createLocalGame(2);
			this.env.start();
			this.env.randomPick();
		});

		describe('on 7', function() {
			describe('with resources to drop', function() {
				beforeEach(function() {
					// Roll dices until it gets a 7
					var total;
					for (let i = 0; i < 100; i+= 1) {
						this.env.setPlayerResources(0, { ble: 6, bois: 4 });
						this.env.setPlayerResources(1, { ble: 5, bois: 3 });

						let player = this.env.players[i % 2].player;
						let dice = this.env.game.rollDice(player);
						total = dice[0] + dice[1];
						if (total === 7) {
							break;
						}	else {
							this.env.game.endTurn(player);
						}
					}
					if (total !== 7) { throw new Error('Failed to get 7'); }
				});

				it('notifies all players to drop resources', function() {
					for (let p of this.env.players) {
						var lastAction = p.client.lastMessage('game:action');
						var remaining = {};
						remaining[ this.env.players[ 0 ].id ] = 5;
						remaining[ this.env.players[ 1 ].id ] = 4;
						expect(lastAction).toEqual({ action: 'drop resources', remaining: remaining });
					}
				});
			});

			describe('without resources to drop', function() {
				beforeEach(function() {
					// Roll dices until it gets a 7
					var total;
					for (let i = 0; i < 100; i+= 1) {
						// Clear player resources
						for (let { player: player } of this.env.players) {
							player.useResources(player.resources);
						}

						let player = this.env.players[i % 2].player;
						let dice = this.env.game.rollDice(player);
						total = dice[0] + dice[1];
						if (total === 7) {
							break;
						}	else {
							this.env.game.endTurn(player);
						}
					}
					if (total !== 7) { throw new Error('Failed to get 7'); }
				});

				it('directly asks to move thieves', function() {
					for (let p of this.env.players) {
						var lastAction = p.client.lastMessage('game:action');
						expect(lastAction).toEqual({ action: 'move thieves' });
					}
				});
			});
		});

		describe('on value != 7', function() {
			beforeEach(function() {
				// Empty resources not to drop cards
				for (let p of this.env.players) { p.player.useResources(p.player.resources); }

				// Roll dices while it gets a 7
				var total;
				for (let i = 0; i < 100; i+= 1) {
					let p = this.env.players[i % 2];
					let dice = this.env.game.rollDice(p.player);
					total = dice[0] + dice[1];
					if (total !== 7) {
						break;
					}	else {
						this.env.moveThieves(p);
						this.env.game.endTurn(p.player);
					}
				}
				if (total === 7) { throw new Error('Failed not to get 7'); }
			});

			it('directly authorize to play', function() {
				for (let p of this.env.players) {
					var lastAction = p.client.lastMessage('game:action');
					expect(lastAction).toEqual({ action: 'play' });
				}
			});

			xit('assigns resources', function() {
				// TODO code this test
			});
		});
	});

	describe('#dropResources', function() {
		beforeEach(function() {
			this.env = starter.createLocalGame(2);
			this.env.start();
			this.env.randomPick();

			// Roll dices until it gets a 7
			var total;
			for (let i = 0; i < 100; i+= 1) {
				for (let { player: player } of this.env.players) {
					player.useResources(player.resources);
					player.receiveResources({ bois: 5, ble: 5 }); // 5 to drop
				}

				let player = this.env.players[i % 2].player;
				let dice = this.env.game.rollDice(player);
				total = dice[0] + dice[1];
				if (total === 7) {
					break;
				}	else {
					this.env.game.endTurn(player);
				}
			}
			if (total !== 7) { throw new Error('Failed to get 7'); }
		});

		it('gives the number of remaining resources to drop', function() {
			var firstPlayer = this.env.players[0].player;
			var remaining = this.env.game.dropResources(firstPlayer, { bois: 1, ble: 2 });
			expect(remaining).toEqual(2);
		});

		it('does not complete until all players have dropped their resources', function() {
			var firstPlayer = this.env.players[0].player;
			this.env.game.dropResources(firstPlayer, { bois: 3, ble: 2 });

			// Action play not received
			for (let { client: client } of this.env.players) {
				expect(client.lastMessage('game:action')).not.toEqual({ action: 'play' });
			}
		});

		it('asks to move the thieves when all players have dropped resources', function() {
			for (let { player: player } of this.env.players) {
				this.env.game.dropResources(player, { bois: 3, ble: 2 });
			}

			for (let { client: client } of this.env.players) {
				expect(client.lastMessage('game:action')).toEqual({ action: 'play' });
			}
		});
	});

});