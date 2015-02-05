import Location from './location';

export default class City {

	constructor(x, y) {
		this._location = new Location(x, y);
		this._buildable = true;
	}

	get location() {
		return this._location;
	}

	get buildable() {
		return this._buildable;
	}

}