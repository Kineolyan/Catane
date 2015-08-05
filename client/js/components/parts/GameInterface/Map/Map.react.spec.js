import tests from 'client/js/components/libs/test';
import { BoardBinding } from 'client/js/components/common/map';

import MapReact from 'client/js/components/parts/GameInterface/Map/Map.react';
import Tile from 'client/js/components/parts/GameInterface/Map/Tile.react';
import Path from 'client/js/components/parts/GameInterface/Map/Path.react';
import City from 'client/js/components/parts/GameInterface/Map/City.react';

describe('<Map>', function() {
	beforeAll(function() {
		this.definition = {
			tiles: [
				{ x: 0, y: 0, resource: 'tuile', diceValue: 1 },
				{ x: 1, y: 1, resource: 'bois', diceValue: 2 },
				{ x: 2, y: -1, resource: 'desert' }/*,
				{ x: 1, y: -2, resource: 'tuile', diceValue: 1 },
				{ x: -1, y: -1, resource: 'tuile', diceValue: 1 },
				{ x: -2, y: 1, resource: 'tuile', diceValue: 1 },
				{ x: -1, y: 2, resource: 'tuile', diceValue: 1 }*/
			], cities: [
				{ x: 0, y: 1 },
				{ x: 1, y: 0 },
				{ x: 1, y: -1 },
				{ x: 0, y: -1 }/*,
				{ x: -1, y: 0 },
				{ x: -1, y: 1 },
				{ x: 1, y: 2 },
				{ x: 2, y: 1 },
				{ x: 2, y: 0 },
				{ x: 0, y: 2 },
				{ x: 3, y: -1 },
				{ x: 3, y: -2 },
				{ x: 2, y: -2 },
				{ x: 2, y: -3 },
				{ x: 1, y: -3 },
				{ x: 0, y: -2 },
				{ x: -1, y: -2 },
				{ x: -2, y: -1 },
				{ x: -2, y: 0 },
				{ x: -2, y: 2 },
				{ x: -3, y: 1 },
				{ x: -3, y: 2 },
				{ x: -1, y: 3 },
				{ x: -2, y: 3 }*/
			], paths: [
				{ from: { x: 1, y: 0 }, to: { x: 0, y: 1 } },
				{ from: { x: 1, y: -1 }, to: { x: 1, y: 0 } }/*,
				{ from: { x: 0, y: -1 }, to: { x: 1, y: -1 } },
				{ from: { x: 0, y: -1 }, to: { x: -1, y: 0 } },
				{ from: { x: -1, y: 0 }, to: { x: -1, y: 1 } },
				{ from: { x: -1, y: 1 }, to: { x: 0, y: 1 } },
				{ from: { x: 2, y: 1 }, to: { x: 1, y: 2 } },
				{ from: { x: 2, y: 0 }, to: { x: 2, y: 1 } },
				{ from: { x: 1, y: 0 }, to: { x: 2, y: 0 } },
				{ from: { x: 0, y: 1 }, to: { x: 0, y: 2 } },
				{ from: { x: 0, y: 2 }, to: { x: 1, y: 2 } },
				{ from: { x: 3, y: -1 }, to: { x: 2, y: 0 } },
				{ from: { x: 3, y: -2 }, to: { x: 3, y: -1 } },
				{ from: { x: 2, y: -2 }, to: { x: 3, y: -2 } },
				{ from: { x: 2, y: -2 }, to: { x: 1, y: -1 } },
				{ from: { x: 2, y: -3 }, to: { x: 2, y: -2 } },
				{ from: { x: 1, y: -3 }, to: { x: 2, y: -3 } },
				{ from: { x: 1, y: -3 }, to: { x: 0, y: -2 } },
				{ from: { x: 0, y: -2 }, to: { x: 0, y: -1 } },
				{ from: { x: -1, y: -2 }, to: { x: 0, y: -2 } },
				{ from: { x: -1, y: -2 }, to: { x: -2, y: -1 } },
				{ from: { x: -2, y: -1 }, to: { x: -2, y: 0 } },
				{ from: { x: -2, y: 0 }, to: { x: -1, y: 0 } },
				{ from: { x: -1, y: 1 }, to: { x: -2, y: 2 } },
				{ from: { x: -2, y: 0 }, to: { x: -3, y: 1 } },
				{ from: { x: -3, y: 1 }, to: { x: -3, y: 2 } },
				{ from: { x: -3, y: 2 }, to: { x: -2, y: 2 } },
				{ from: { x: 0, y: 2 }, to: { x: -1, y: 3 } },
				{ from: { x: -2, y: 2 }, to: { x: -2, y: 3 } },
				{ from: { x: -2, y: 3 }, to: { x: -1, y: 3 } }*/
			]
		};

		var ctx = tests.getCtx({});
		var helper = new BoardBinding(ctx.getBinding());
		helper.buildBoard(this.definition);

		this.element = tests.bootstrap(ctx, MapReact);
	});

	it('renders the tiles', function() {
		expect(tests.getRenderedElements(this.element, Tile)).toHaveLength(this.definition.tiles.length);
	});

	it('renders the cities', function() {
		expect(tests.getRenderedElements(this.element, City)).toHaveLength(this.definition.cities.length);
	});

	it('renders the paths', function() {
		expect(tests.getRenderedElements(this.element, Path)).toHaveLength(this.definition.paths.length);
	});

});
