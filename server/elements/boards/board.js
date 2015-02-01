export default class Board {

	constructor() {
		this._tiles = [];
		this._cities = [];
		this._paths = [];
	}

	get tiles() {
		return this._tiles;
	}

	get cities() {
		return this._cities;
	}

	get paths() {
		return this._paths;
	}

	generate(generator) {
		generator.forEachTile(tile => this._tiles.push(tile));
		generator.forEachCity(city => this._cities.push(city));
		generator.forEachPath(path => this._paths.push(path));
	}

}