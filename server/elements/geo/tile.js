import Location from './location';

export default class Tile {

	/**
	 * Constructor
	 * @param  {Integer} x x-coordinate
	 * @param  {Integer} y y-coordinate
	 * @param  {String} resource the resource
	 * @param  {String} diceValue the dice value
	 */
	constructor(x, y, resource, diceValue) {
		this._location = new Location(x, y);
		this._resource = resource;
		this._cities = [];
		this._diceValue = diceValue;
	}

	get location() {
		return this._location;
	}

	get resource() {
		return this._resource;
	}

	set resource(value) {
		this._resource = value;
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

	/**
	 * Adds a city to the tile.
	 * @param city the new city located in the tile.
	 */
	addCity(city) {
		this._cities.push(city);
	}

	/**
	 * Distributes the resources to colonies and cities belonging
	 * to the tile.
	 */
	distributeResources() {
		var resources = {};
		for (let spot of this._cities) {
			if (null !== spot.owner) {
				resources[this._resource] = spot.isCity() ? 2 : 1;
				spot.owner.receiveResources(resources);
			}
		}
	}
}