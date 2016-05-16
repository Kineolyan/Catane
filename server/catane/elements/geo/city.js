import Location from 'server/catane/elements/geo/location';

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

	isCity() {
		return !this._buildable;
	}

	get owner() {
		return this._owner;
	}

	set owner(owner) {
		if (this._owner === null) {
			this._owner = owner;
			return owner;
		} else {
			throw new Error(`City ${this._location} already owned by ${this._owner}`);
		}
	}

	/**
	 * Transforms a colony into a city.
	 * @throws Error if the operation is not possible
	 */
	evolve() {
		if (this._buildable) {
			this._buildable = false;
		} else {
			throw new Error(`Cannot evolve the city ${this._location} anymore`);
		}
	}

}