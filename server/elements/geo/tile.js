import Location from './location';

export default class Tile {

	constructor(x, y, resource) {
		this._location = new Location(x, y);
		this._resource = resource;
		this._cities = [];
		this._diceValue = undefined;
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

	get diceValue() {
		return this._diceValue;
	}

	set diceValue(value) {
		this._diceValue = value;
	}

	addCity(city) {
		this._cities.push(city);
	}

}