'use strict';

import Immutable from 'immutable';

import Players from 'client/js/components/common/players';

var unitSize = 60;
const SIN_PI_3 = 0.87;
const COS_PI_3 = 0.5

/**
 * Get the size of one edge of a tiles
 * @param {Number} x x-coordinate in hexacoordinate
 * @param {Number} y y-coordinate in hexacoordinate
 * @return {Object} new position in the orthogonal coordinate
 */
function convert({ x: x, y: y }) {
	var newCoords = this || {};
	newCoords.x = y + x * COS_PI_3;
	newCoords.y = x * SIN_PI_3;

	return newCoords;
}

/**
 * Get the size of one edge of a tiles
 * @param {Array} tiles of the game
 * @param {Number} width width of the map
 * @param {Number} height height of the map
 * @param {Number} margin top and bottom margin of the map
 * @return {Number} the size of one edge
 */
function getSize(tiles, width, height, margin) {
	var min = {
		x: 0,
		y: 0
	};
	var max = {
		x: 0,
		y: 0
	};

	var size = 0;
	for (let i = 0; i < tiles.length; i += 1) {
		var t = tiles[i];
		for (let j of ['x', 'y']) {

			if (t[j] > 0 && t[j] > max[j]) {
				max[j] = t[j];
			}

			if (t[j] < 0 && t[j] < min[j]) {
				min[j] = t[j];
			}
		}
	}

	var tmpWidth = parseInt((width - margin) / ((max.x - min.x)), 10);
	var tmpHeight = parseInt((height - margin) / ((max.y - min.y)), 10);

	var tmp = convert(tmpWidth, tmpHeight);
	if (tmp.x < tmp.y) {
		size = tmp.x;
	} else {
		size = tmp.y;
	}

	return size * 0.87;
}

// Abstract class for a map element
var index = 0;

export class GeometryBinding {
	constructor(binding) {
		this._binding = binding;
	}

	get binding() {
		return this._binding;
	}

	static from(binding) {
		return new GeometryBinding(binding.get('geometry'));
	}

	save(binding) {
		return binding.set('geometry', this._binding);
	}

	computeUnitSize(tiles, margin, width, height) {
		width = width || this.binding.get('width') || window.innerWidth;
		height = height || this.binding.get('height') || window.innerHeight;
	}
}

export class BoardBinding {
	constructor(binding) {
		this._binding = binding;
	}

	get binding() {
		return this._binding;
	}

	static from(binding) {
		return new BoardBinding(binding.get('board'));
	}

	save(binding) {
		return binding.set('board', this._binding);
	}

	buildBoard(definition) {
		var tiles = definition.tiles.map(BoardBinding.buildTile);
		var cities = definition.cities.map(BoardBinding.buildCity);
		var paths = definition.paths.map(BoardBinding.buildPath);

		this._binding = this._binding
			.set('tiles', Immutable.fromJS(tiles))
			.set('cities', Immutable.fromJS(cities))
			.set('paths', Immutable.fromJS(paths));
	}

	static buildTile(definition) {
		var tile = Object.assign({}, definition);
		tile.key = { x: tile.x, y: tile.y };
		convert.call(tile, tile);

		return tile;
	}

	static buildCity(definition) {
		var city = Object.assign({}, definition);
		city.key = { x: city.x, y: city.y };
		convert.call(city, city);

		return city;
	}

	static buildPath(definition) {
		var path = Object.assign({}, definition);
		path.key = {
			from: Object.assign({}, path.from),
			to: Object.assign({}, path.to)
		};
		convert.call(path.from, path.from);
		convert.call(path.to, path.to);

		return path;
	}
}

/**
 * Map helpher, transforming hexa coordinate to orthogonal.
 */
class MapHelpher {

	constructor(board, margin = 10, width = window.innerWidth, height = window.innerHeight) {
		if (!board.tiles) {
			return {};
		}

		// set the size of the base unit
		unitSize = getSize(board.tiles, height, width, margin);

		this._elements = new Map();

		for (let type in board) {
			if (board.hasOwnProperty(type)) {
				let Cons;
				switch (type) {
					case 'cities':
						Cons = City;
						break;

					case 'tiles':
						Cons = Tile;
						break;

					case 'paths':
						Cons = Path;
						break;
				}

				if (!Cons) {
					continue;
				}

				var elements = new Map();

				for (let i = 0; i < board[type].length; i += 1) {
					// if a specific key is declared in the original object, for further retrieval
					var key = board[type][i].key ? board[type][i].key : board[type][i];
					elements.set(JSON.stringify(key), new Cons(board[type][i]));
				}

				this._elements.set(type, elements);
			}
		}

	}

	get elements() {
		return this._elements;
	}

	/**
	 * Give a map element to a player
	 * @param  {String} type   The element's type (tiles, cities, paths)
	 * @param  {Object} key    The key of the element (generaly a json of x and y coordinates)
	 * @param  {Player} player The player
	 * @return {MapHelpher} this
	 */
	giveElement(type, key, player) {
		var elem = this.getElementOfType(type, key);
		if (elem) {
			elem.player = player;
		} else {
			throw new Error(`No elem '${type}' with key ${JSON.stringify(key)}`);
		}

		return this;
	}

	/**
	 * Get the element of a given type
	 * @param  {String} type   The element's type (tiles, cities, paths)
	 * @param  {Object} key    The key of the element (generaly a json of x and y coordinates)
	 * @return {MapElement}    An element of the map
	 */
	getElementOfType(type, key) {
		if (this._elements.has(type)) {
			return this._elements.get(type).get(JSON.stringify(key));
		} else {
			throw new Error(`No elements of type: ${type}`);
		}
	}

	/**
	 * Set a map element selectable
	 * @param {String} type The type of element to make selectable
	 * @return {MapHelpher} this
	 */
	setSelectableType(type) {

		for (let [elemsType, elems] of this._elements.entries()) {
			for (let [, part] of elems.entries()) {
				part.selectable = (type === elemsType && !part.player);
			}

		}

		return this;
	}
}

export default {
	board: null,
	init() {
		this.board = new MapHelpher(...arguments);
		return this;
	},

	getBoard() {
		return this.board;
	},

	toJS() {
		var obj = {};

		this.board.elements.forEach((typeElement, index) => {
			obj[index] = [];
			typeElement.forEach((mapElement) => {
				obj[index].push(mapElement);
			});
		});

		return obj;
	},
	reset() {
		index = 0;
	}

};