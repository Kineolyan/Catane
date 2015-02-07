import Location from './location';

export default class Tile {

	constructor(x, y, resource) {
		this._location = new Location(x, y);
		this._resource = resource;
		this._cities = [];
	}

	get location() {
		return this._location;
	}

	get resource() {
		return this._resource;
	}

	get cities() {
		return this._cities;
	}

	addCity(city) {
		this._cities.push(city);
	}

}