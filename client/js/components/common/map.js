'use strict';

import Immutable from 'immutable';

const SIN_PI_3 = 0.87;
const COS_PI_3 = 0.5;

/**
 * Get the size of one edge of a tiles
 * @param {Number} x x-coordinate in hexacoordinate
 * @param {Number} y y-coordinate in hexacoordinate
 * @return {Object} new position in the orthogonal coordinate
 */
export function convert({ x: x, y: y }) {
	var newCoords = this || {};
	newCoords.x = y + x * COS_PI_3;
	newCoords.y = x * SIN_PI_3;

	return newCoords;
}

export const VERTICES = [
	convert({ x: 0, y: -1 }),
	convert({ x: 1, y: -1 }),
	convert({ x: 1, y: 0 }),
	convert({ x: 0, y: 1 }),
	convert({ x: -1, y: 1 }),
	convert({ x: -1, y: 0 })
];

const MAX_COORD = 50;
const HASH_BASE = 101;

function offset(coord) {
	return coord + MAX_COORD;
}

function locationHash(location) {
	return (location.x * HASH_BASE + location.y).toString();
}

function vectorHash({ from: from, to: to }) {
	// We order by low x then low y.
	if ((from.x < to.x && from.y <= to.y)
		|| (from.x >= to.x && from.y < to.y)) {
		return (offset(from.x)
			+ HASH_BASE * (offset(from.y)
				+ HASH_BASE * (offset(to.x)
					+ HASH_BASE * offset(to.y)
				)
			)).toString();
	} else {
		return vectorHash({ from: to, to: from });
	}
}

export class BoardBinding {
	constructor(binding) {
		this._binding = binding;
		this.hash = {
			tiles: locationHash,
			cities: locationHash,
			paths: vectorHash
		};
	}

	get binding() {
		return this._binding;
	}

	static from(binding) {
		return new BoardBinding(binding.get('game.board'));
	}

	save(binding) {
		return binding.set('game.board', this._binding);
	}

	buildBoard(definition) {
		var tiles = BoardBinding.mapElements(definition.tiles, BoardBinding.buildTile, this.hash.tiles);
		var cities = BoardBinding.mapElements(definition.cities, BoardBinding.buildCity, this.hash.cities);
		var paths = BoardBinding.mapElements(definition.paths, BoardBinding.buildPath, this.hash.paths);

		// Set the thieves on the correct tile
		var thieves = definition.thieves;
		tiles[this.hash.tiles(thieves)].thieves = true;

		this._binding = this._binding
			.set('tiles', Immutable.fromJS(tiles))
			.set('cities', Immutable.fromJS(cities))
			.set('paths', Immutable.fromJS(paths));

		return this;
	}

	static mapElements(elements, conversion, hash) {
		var mapping = {};
		for (let element of elements) {
			mapping[hash(element)] = conversion(element);
		}

		return mapping;
	}

	static buildTile(definition) {
		var tile = JSON.parse(JSON.stringify(definition));
		tile.key = { x: tile.x, y: tile.y };
		convert.call(tile, tile);

		return tile;
	}

	static buildCity(definition) {
		var city = JSON.parse(JSON.stringify(definition));
		city.key = { x: city.x, y: city.y };
		convert.call(city, city);

		return city;
	}

	static buildPath(definition) {
		var path = JSON.parse(JSON.stringify(definition));
		path.key = {
			from: Object.assign({}, path.from),
			to: Object.assign({}, path.to)
		};
		convert.call(path.from, path.from);
		convert.call(path.to, path.to);

		return path;
	}

	/**
	 * Get the element of a given type
	 * @param  {String} type   The element's type (tiles, cities, paths)
	 * @param  {Object} key    The key of the element (generaly a json of x and y coordinates)
	 * @return {Binding} binding of the element or null
	 */
	getElement(type, key) {
		var typeBinding = this._binding.get(type);
		if (typeBinding) {
			return typeBinding.get(this.hash[type](key)) || null;
		} else {
			throw new Error(`No elements of type: ${type}`);
		}
	}

	updateElement(type, key, updater) {
		if (this._binding.has(type)) {
			this._binding = this._binding.update(type, typeBinding => {
				let hashcode = this.hash[type](key);
				if (typeBinding.has(hashcode)) {
					return typeBinding.update(hashcode, updater);
				} else {
					throw new Error(`No '${type}' with key ${key}`);
				}
			});
		} else {
			throw new Error(`No elements of type: ${type}`);
		}
	}

	/**
	 * Give a map element to a player
	 * @param  {String} type   The element's type (tiles, cities, paths)
	 * @param  {Object} key    The key of the element (generaly a json of x and y coordinates)
	 * @param  {Binding} player binding to the player owning the element
	 * @return {MapHelpher} this
	 */
	giveElement(type, key, player) {
		if (/cities|paths/.test(type)) {
			this.updateElement(type, key, element => element.set('owner', player.get('id')));
		} else {
			throw new Error('Cannot give ' + type);
		}

		return this;
	}

	/**
	 * Set a map element selectable
	 * @param {String} type The type of element to make selectable
	 * @param {Boolean} state selectable state
	 * @param {Function?} cbk callback on the element
	 * @return {MapHelpher} this
	 */
	setSelectable(type, state, cbk) {
		if (this._binding.has(type)) {
			let updater;
			if (cbk instanceof Function) {
				updater = state ?
					function(element, current) { return current || cbk(element); } :
					function(element, current) { return current && !cbk(element); };
			} else if (cbk === undefined) {
				updater = function() { return state; };
			} else {
				throw new Error(`Invalid callback argument: ${cbk}`);
			}

			this._binding = this.binding.update(type, typeBinding => {
				return typeBinding.map(element => {
					return element.update('selectable', updater.bind(null, element));
				});
			});
		} else {
			throw new Error(`No elements of type ${type}`);
		}

		return this;
	}

	/**
	 * Moves the thieves onto the given tile.
	 * @param  {Object} tile the tile position of the thieves
	 * @return {BoardBinding} this
	 */
	moveThieves(tile) {
		var thievesHash = this.hash.tiles(tile);
		this._binding = this._binding.update('tiles', (tiles) => {
			return tiles.map((binding, hash) => binding.set('thieves', hash === thievesHash));
		});

		return this;
	}

	static emptyElement(element) {
		return element.get('player') === undefined;
	}
}
