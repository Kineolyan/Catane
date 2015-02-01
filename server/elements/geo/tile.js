import Location from './location';

export default class Tile {

	constructor(x, y, resource) {
		this._location = new Location(x, y);
		this._resource = resource;
	}

	get location() {
		return this._location;
	}

	get resource() {
		return this._resource;
	}

}