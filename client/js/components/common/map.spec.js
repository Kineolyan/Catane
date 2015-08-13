import tests from 'client/js/components/libs/test';

import { BoardBinding } from 'client/js/components/common/map';
import { PlayersBinding } from 'client/js/components/common/players';

describe('BoardBinding', function() {
	describe('::buildTile', function() {
		beforeEach(function() {
			this.definition = { x: 10, y: 10, resource: 'tuile', diceValue: 1 };
			this.tile = BoardBinding.buildTile(this.definition);
		});

		it('has coordinates as keys', function() {
			expect(this.tile.key).toEqual({ x: 10, y: 10 });
		});

		it('has converted coordinates', function() {
			expect(this.tile.x).toBeClose(15, 0.1);
			expect(this.tile.y).toBeClose(8.7, 0.1);
		});

		it('has dice value', function() {
			expect(this.tile.diceValue).toEqual(1);
		});

		it('has resource', function() {
			expect(this.tile.resource).toEqual('tuile');
		});

		it('has no player', function() {
			expect(this.tile).not.toHaveKey('player');
		});

		it('supports desert tile', function() {
			var tile = BoardBinding.buildTile({ x: 10, y: 10, resource: 'desert' });
			expect(tile).not.toHaveKey('diceValue');
		});

		it('supports player definition', function() {
			var tile = BoardBinding.buildTile({ x: 10, y: 10, resource: 'tuile', diceValue: 1, player: 123 });
			expect(tile.player).toEqual(123);
		});
	});

	describe('::buildCity', function() {
		beforeEach(function() {
			this.definition = { x: 10, y: 20 };
			this.city = BoardBinding.buildCity(this.definition);
		});

		it('has coordinates as keys', function() {
			expect(this.city.key).toEqual({ x: 10, y: 20 });
		});

		it('has converted coordinates', function() {
			expect(this.city.x).toBeClose(25, 0.1);
			expect(this.city.y).toBeClose(8.7, 0.1);
		});

		it('has no player', function() {
			expect(this.city).not.toHaveKey('player');
		});

		it('supports player definition', function() {
			var city = BoardBinding.buildCity({ x: 10, y: 10, player: 123 });
			expect(city.player).toEqual(123);
		});
	});

	describe('::buildPath', function() {
		beforeEach(function() {
			this.definition = {
				from: { x: 10, y: 20 },
				to: { x: 20, y: 10 }
			};
			this.path = BoardBinding.buildPath(this.definition);
		});

		it('has coordinates as keys', function() {
			expect(this.path.key).toEqual({
				from: { x: 10, y: 20 },
				to: { x: 20, y: 10 }
			});
		});

		it('has converted coordinates', function() {
			expect(this.path.from.x).toBeClose(25, 0.1);
			expect(this.path.from.y).toBeClose(8.7, 0.1);
			expect(this.path.to.x).toBeClose(20, 0.1);
			expect(this.path.to.y).toBeClose(17.4, 0.1);
		});

		it('has no player', function() {
			expect(this.path).not.toHaveKey('player');
		});

		it('supports player definition', function() {
			var path = BoardBinding.buildPath({
				from: { x: 10, y: 20 },
				to: { x: 20, y: 10 },
				player: 123
			});
			expect(path.player).toEqual(123);
		});
	});

	describe('#buildBoard', function() {
		beforeEach(function() {
			this.definition = {
				tiles: [
					{ x: 0, y: 0, resource: 'bois', diceValue: 1 },
					{ x: 1, y: 1, resource: 'desert' }
				], cities: [
					{ x: 0, y: 1 },
					{ x: 1, y: 0 },
					{ x: 1, y: -1 }
				], paths: [
					{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } }
				], thieves: { x: 1, y: 1 }
			};

			var ctx = tests.getCtx({ game: { board: {} } });
			this.helper = BoardBinding.from(ctx.getBinding());
			this.helper.buildBoard(this.definition);
		});

		// TODO may improve this with behave_like
		it('has 2 adapted tiles', function() {
			var tiles = this.helper.binding.get('tiles').map(tile => tile.get('key'));
			var values = [];
			for (let value of tiles.values()) {
				values.push(value.toJS());
			}

			expect(values).toContain({ x: 0, y: 0 });
			expect(values).toContain({ x: 1, y: 1 });
		});

		it('has 3 adapted cities', function() {
			var cities = this.helper.binding.get('cities').map(city => city.get('key'));
			var values = [];
			for (let value of cities.values()) {
				values.push(value.toJS());
			}

			expect(values).toContain({ x: 0, y: 1 });
			expect(values).toContain({ x: 1, y: 0 });
			expect(values).toContain({ x: 1, y: -1 });
		});

		it('has 1 adapted path', function() {
			var paths = this.helper.binding.get('paths').map(path => path.get('key'));
			var values = [];
			for (let value of paths.values()) {
				values.push(value.toJS());
			}

			expect(values).toContain({ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } });
		});

		it('sets the thieves on the correct tile', function() {
			var tile = this.helper.getElement('tiles', { x: 1, y: 1 });
			expect(tile.get('thieves')).toBe(true);
		});
	});

	describe('#getElement', function() {
		beforeEach(function() {
			this.definition = {
				tiles: [
					{ x: 0, y: 0, resource: 'bois', diceValue: 1 },
					{ x: 1, y: 1, resource: 'desert' }
				], cities: [
					{ x: 0, y: 1 },
					{ x: 1, y: 0 },
					{ x: 1, y: -1 }
				], paths: [
					{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } }
				], thieves: { x: 1, y: 1 }
			};

			var ctx = tests.getCtx({ game: { board: {} } });
			this.helper = BoardBinding.from(ctx.getBinding());
			this.helper.buildBoard(this.definition);
		});

		it('finds tiles', function() {
			var tile = this.helper.getElement('tiles', { x: 0, y: 0 });
			expect(tile.get('diceValue')).toEqual(1);
		});

		it('finds cities', function() {
			var location = { x: 0, y: 1 };
			var city = this.helper.getElement('cities', location);
			expect(city.get('key').toJS()).toEqual(location);
		});

		it('finds paths', function() {
			var path = this.helper.getElement('paths', { from: { x: 1, y: 0 }, to: { x: 0, y: 1 } });
			expect(path).not.toBe(null);
		});

		it('throws on wrong type', function() {
			expect(() => {
				this.helper.getElement('zozo', { x: 0, y: 0 });
			}).toThrowError();
		});

		it('returns null if it does not exist', function() {
			var tile = this.helper.getElement('tiles', { x: 1, y: 0 });
			expect(tile).toBe(null);
		});
	});

	describe('#giveElement', function() {
		beforeEach(function() {
			this.definition = {
				tiles: [
					{ x: 0, y: 0, resource: 'bois', diceValue: 1 },
					{ x: 1, y: 1, resource: 'desert' }
				], cities: [
					{ x: 0, y: 1 },
					{ x: 1, y: 0 },
					{ x: 1, y: -1 }
				], paths: [
					{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } }
				], thieves: { x: 1, y: 1 }
			};

			var ctx = tests.getCtx({ game: { board: {} }, players: [] });

			var playerBinding = PlayersBinding.from(ctx.getBinding());
			playerBinding.setIPlayer(1, 'bob', 'green');
			playerBinding.save(ctx.getBinding());
			this.player = playerBinding.getPlayer(1);

			this.helper = BoardBinding.from(ctx.getBinding());
			this.helper.buildBoard(this.definition);
		});

		it('rejects assignment of tiles', function() {
			expect(() => {
				this.helper.giveElement('tiles', null);
			}).toThrowError(/Cannot give tiles/i);
		});

		it('assigns cities', function() {
			var location = this.definition.cities[0];
			this.helper.giveElement('cities', location, this.player);

			var city = this.helper.getElement('cities', location);
			expect(city.get('owner')).toEqual(1);
		});

		it('assigns paths', function() {
			var location = this.definition.paths[0];
			this.helper.giveElement('paths', location, this.player);

			var city = this.helper.getElement('paths', location);
			expect(city.get('owner')).toEqual(1);
		});

		it('throws for assignment of unknown type', function() {
			expect(() => {
				this.helper.giveElement('board', null);
			}).toThrow();
		});
	});

	describe('#setSelectable', function() {
		beforeEach(function() {
			this.definition = {
				tiles: [
					{ x: 0, y: 0, resource: 'bois', diceValue: 1 },
					{ x: 1, y: 1, resource: 'desert' }
				], cities: [
					{ x: 0, y: 1, player: 1 },
					{ x: 1, y: 0 },
					{ x: 1, y: -1 }
				], paths: [
					{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 }, player: 1 },
					{ from: { x: 0, y: 1 }, to: { x: 1, y: 1 } }
				], thieves: { x: 1, y: 1 }
			};

			var ctx = tests.getCtx({ game: { board: {} }, players: [] });
			this.helper = BoardBinding.from(ctx.getBinding());
			this.helper.buildBoard(this.definition);
		});

		it('sets selectable according to the cbk', function() {
			this.helper.setSelectable('cities', true, () => true);

			expect(this.helper.binding.get('cities').every(city => city.get('selectable') === true)).toBe(true);
		});

		it('sets selectable to empty cities', function() {
			this.helper.setSelectable('cities', true, BoardBinding.emptyElement);

			// Cities with player are not selectable
			expect(this.helper.getElement('cities', this.definition.cities[0]).get('selectable')).not.toBe(true);

			// Cities without players are selectable
			expect(this.helper.getElement('cities', this.definition.cities[1]).get('selectable')).toBe(true);
			expect(this.helper.getElement('cities', this.definition.cities[2]).get('selectable')).toBe(true);
		});

		it('sets selectable to empty paths', function() {
			this.helper.setSelectable('paths', true, BoardBinding.emptyElement);

			// Paths with player are not selectable
			expect(this.helper.getElement('paths', this.definition.paths[0]).get('selectable')).not.toBe(true);

			// Paths without player are selectable
			expect(this.helper.getElement('paths', this.definition.paths[1]).get('selectable')).toBe(true);
		});

		it('unsets all elements', function() {
			this.helper.setSelectable('cities', true, BoardBinding.emptyElement);
			this.helper.setSelectable('cities', false);

			expect(this.helper.binding.get('cities').every(city => city.get('selectable') !== true)).toBe(true);
		});
	});

	describe('#moveThieves', function() {
		beforeEach(function() {
			var ctx = tests.getCtx({ game: { board: {} }, players: [] });
			this.helper = BoardBinding.from(ctx.getBinding());
			this.helper.buildBoard({
				tiles: [
					{ x: 0, y: 0 },
					{ x: 1, y: 0 },
					{ x: 0, y: 1 }
				], cities: [{ x: 0, y: 0 }],
				paths: [{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
				thieves: { x: 0, y: 0 }
			});
			this.helper.moveThieves({ x: 1, y: 0 });
		});

		it('removes thieves from the previous tile', function() {
			var previousTile = this.helper.getElement('tiles', { x: 0, y: 0 });
			expect(previousTile.get('thieves')).toBeFalsy();
		});

		it('moves the thieves onto the designated tile', function() {
			var newTile = this.helper.getElement('tiles', { x: 1, y: 0 });
			expect(newTile.get('thieves')).toEqual(true);
		});

		it('does not affect the other tiles', function() {
			var tile = this.helper.getElement('tiles', { x: 0, y: 1 });
			expect(tile.get('thieves')).toBeFalsy();
		});

	});
});