import Path from 'server/elements/geo/path.js';
import * as geo from 'server/elements/geo/geo';

export default class Board {

	constructor() {
		this._tiles = new Map();
		this._cities = new Map();
		this._paths = new Map();
		this._thieves = null;
	}

	get tiles() {
		return Array.from(this._tiles.values());
	}

	get cities() {
		return Array.from(this._cities.values());
	}

	get paths() {
		return Array.from(this._paths.values());
	}

	/**
	 * Gets the thieves location
	 * @return {Location} the location or null if not defined
	 */
	get thieves() {
		return this._thieves;
	}

	/**
	 * Sets the new location for the thieves
	 * @param {Location} location the new location
	 */
	set thieves(location) {
		this._thieves = location;
	}

	toJson() {
		var description = { tiles: [], cities: [], paths: [] };
		for (let tile of this._tiles.values()) {
			description.tiles.push({
				x: tile.location.x,
				y: tile.location.y,
				resource: tile.resource,
				diceValue: tile.diceValue
			});
		}
		for (let city of this._cities.values()) {
			let cityDescription = {
				x: city.location.x,
				y: city.location.y
			};
			if (city.owner !== null) { cityDescription.owner = city.owner.id; }

			description.cities.push(cityDescription);
		}
		for (let path of this._paths.values()) {
			let pathDescription = {
				from: { x: path.from.x, y: path.from.y },
				to: { x: path.to.x, y: path.to.y }
			};
			if (path.owner !== null) { pathDescription.owner = path.owner.id; }
			description.paths.push(pathDescription);
		}

		if (this._thieves !== null) {
			description.thieves = this._thieves.toJson();
		}

		return description;
	}

	/**
	 * Gets the tile at a given location
	 * @param {Location} location the asked location
	 * @return {Tile} the tile at the location or undefined if emtpy
	 */
	getTile(location) {
		return this._tiles.get(location.hashCode());
	}

	/**
	 * Gets the city at a given location
	 * @param {Location} location the asked location
	 * @returns {City} the city at the location or undefined if empty
	 */
	getCity(location) {
		return this._cities.get(location.hashCode());
	}

	/**
	 * Gets the path joining the two locations
	 * @param {Location|Path} fromLocation ending path location or a path
	 * @param {Location=} toLocation other ending location of the path
	 * @return {Path} the desired path or undefined if not existing
	 */
	getPath(fromLocation, toLocation) {
		var path = toLocation === undefined ? fromLocation : new Path(fromLocation, toLocation);
		return this._paths.get(path.hashCode());
	}

	/**
	 * Gets all the paths leaving from a location.
	 * @param {Location} location start location for path
	 * @return {Array} the paths starting from the location
	 */
	getPathsFrom(location) {
		return Array.from(this.getSurroundingCities(location), city => this.getPath(location, city.location));
	}

	/**
	 * Gets the cities around a given location.
	 * @param {Location} location the asked location
	 * @return {Array} list of cities around the location
	 */
	getSurroundingCities(location) {
		var cities = [];
		for (let [x, y] of geo.SURROUNDING_CITIES) {
			let nextLocation = location.shift(x, y);
			let nextCity = this._cities.get(nextLocation.hashCode());
			if (nextCity !== undefined) { cities.push(nextCity); }
		}

		return cities;
	}

	/**
	 * Gets the tiles surrounding a city.
	 * @param {Location} location city location
	 * @return {Array} the tiles around the city
	 */
	getSurroundingTiles(location) {
		var tiles = [];
		for (let [x, y] of geo.SURROUNDING_CITIES) {
			let nextLocation = location.shift(x, y);
			let nextTile = this._tiles.get(nextLocation.hashCode());
			if (nextTile !== undefined) { tiles.push(nextTile); }
		}

		return tiles;
	}

	/**
	 * Gets the tiles with the given dice value.
	 * @param {Number} value the dice value to look for
	 * @param {boolean?} excludeThieves do not include tiles with thieves
	 * @return {Array} the tiles with that dice value.
	 */
	getTilesForDice(value, excludeThieves) {
		var excludedLocationHash = excludeThieves === true ? this._thieves.hashCode() : undefined;
		var tiles = [];
		for (let [ hashCode, tile ] of this._tiles) {
			if (tile.diceValue === value && hashCode !== excludedLocationHash) {
				tiles.push(tile);
			}
		}

		return tiles;
	}

	generate(generator) {
		generator.forEachTile(tile => {
			this._tiles.set(tile.location.hashCode(), tile);
			if (tile.resource === 'desert') { this._thieves = tile.location; }
		});
		generator.forEachCity(city => this._cities.set(city.location.hashCode(), city) );
		generator.forEachPath(path => this._paths.set(path.hashCode(), path));
	}

}