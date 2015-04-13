import Location from '../geo/location';
import Path from '../geo/path.js';
import * as geo from '../geo/geo';

function getEntryValue(entry) {
	return entry[1];
}

export default class Board {

	constructor() {
		this._tiles = [];
		this._cities = new Map();
		this._paths = new Map();
	}

	get tiles() {
		return this._tiles;
	}

	get cities() {
		return Array.from(this._cities, getEntryValue);
	}

	get paths() {
		return Array.from(this._paths, getEntryValue);
	}

	/**
	 * Gets the city at a given location
	 * @param location the asked location
	 * @returns {City} the city at the location or undefined if empty
	 */
	getCity(location) {
		return this._cities.get(location.hashCode());
	}

	/**
	 * Gets the path joining the two locations
	 * @param fromLocation ending path location
	 * @param toLocation other ending location of the path
	 * @return {Path} the desired path or undefined if not existing
	 */
	getPath(fromLocation, toLocation) {
		var path = new Path(fromLocation, toLocation);
		return this._paths.get(path.hashCode());
	}

	/**
	 * Gets all the paths leaving from a location.
	 * @param location start location for path
	 * @return {Array} the paths starting from the location
	 */
	getPathsFrom(location) {
		return Array.from(this.getSurroundingCities(location), city => this.getPath(location, city.location));
	}

	/**
	 * Gets the cities around a given location.
	 * @param location the asked location
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

	generate(generator) {
		generator.forEachTile(tile => this._tiles.push(tile));
		generator.forEachCity(city => this._cities.set(city.location.hashCode(), city) );
		generator.forEachPath(path => this._paths.set(path.hashCode(), path));
	}

}