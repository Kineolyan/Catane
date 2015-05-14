import * as starter from './game-spec.starter.js';
import Location from '../../elements/geo/location.js';
import Path from '../../elements/geo/path.js';

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

});