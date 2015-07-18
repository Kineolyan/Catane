'use strict';

import Players from 'client/js/components/common/players';

var unitSize = 60;

/**
 * Get the size of one edge of a tiles
 * @param {Number} x x-coordinate in hexacoordinate
 * @param {Number} y y-coordinate in hexacoordinate
 * @param {Number?} sz of the coordinate
 * @return {Object} new position in the orthogonal coordinate
 */
function convert(x, y, sz) {
	var size = typeof sz !== 'undefined' ? sz : unitSize;

	return {
		y: x * 0.87 * size, // sin(pi/3)
		x: (y + x / 2) * size
	};
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
		for (let j of ['x', 'y']) { // jshint ignore:line

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

	var tmp = convert(tmpWidth, tmpHeight, 1);
	if (tmp.x < tmp.y) {
		size = tmp.x;
	} else {
		size = tmp.y;
	}

	return size * 0.87;
}

// Abstract class for a map element
var index = 0;

class MapElement {
	constructor(element) {
		Object.assign(this, element);

		this.unitSize = unitSize;
		this.index = this.x + ',' + this.y + ',' + index;
		this.key = element;

		this.ortho = convert(this.x, this.y);
		index += 1;

		this._player = null;
		if (element._player) {
			this._player = Players.createFromJS(element._player);
		}


		this._selectable = element._selectable;
	}

	set player(val) {
		this._player = val;
	}

	get player() {
		return this._player;
	}

	set selectable(val) {
		this._selectable = val;
	}

	get selectable() {
		return this._selectable;
	}

}
// A tile with orthogonal coordinate and vertex
class Tile extends MapElement {
	constructor(tile) {
		super(tile);
		// vertex
		this.vertex = [];
		this.vertex.push(convert(0, -1));
		this.vertex.push(convert(1, -1));
		this.vertex.push(convert(1, 0));
		this.vertex.push(convert(0, 1));
		this.vertex.push(convert(-1, 1));
		this.vertex.push(convert(-1, 0));

		// define the key based on coordinates
		this.key = { x: tile.x, y: tile.y };
	}


}

// A city with orthogonal coordinate
class City extends MapElement {
	constructor(city) {
		super(city);

		// define the key based on coordinates
		this.key = { x: city.x, y: city.y };
	}
}

// A path with orthogonal coordinate
class Path extends MapElement {
	constructor(path) {

		super(path);

		this.to = Object.assign({}, path.to);
		this.from = Object.assign({}, path.from);
		this.to.ortho = convert(this.to.x, this.to.y);
		this.from.ortho = convert(this.from.x, this.from.y);

		// define the key based on coordinates
		this.key = { from: path.from, to: path.to };
	}

	get x() {
		return this.from.x;
	}

	get y() {
		return this.from.y;
	}

}

/**
 * Map helpher, transforming hexa coordinate to orthogonal.
 */
class MapHelpher {

	constructor(board, margin = 10) {
		if (!board.tiles) {
			return {};
		}

		// set the size of the base unit
		unitSize = getSize(board.tiles, window.innerHeight, window.innerWidth, margin);

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