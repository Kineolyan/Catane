import Location from './location';

export default class City {

	constructor(x, y) {
		this._location = new Location(x, y);
		this._buildable = true;
		this._owner = null;
	}

	get location() {
		return this._location;
	}

	get buildable() {
		return this._buildable;
	}

	get owner() {
		return this._owner;
	}

	set owner(owner) {
		this._owner = owner;
		return owner;
	}

}