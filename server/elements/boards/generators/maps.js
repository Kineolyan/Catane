import Location from '../../geo/location';
import Tile from '../../geo/tile';
import City from '../../geo/city';
import Path from '../../geo/path';
import { catane } from './dices';
import { RandomResources } from './resources';
import * as geo from '../../geo/geo';

export class RoundGenerator {
	constructor(nbRings) {
		if (nbRings < 1) {
			throw new Error(`Nb of rings must be higher than 1. ${nbRings} provided`);
		}

		this._tiles = new Map();
		this._cities = new Map();
		this._paths = new Map();
		this._diceValues = catane();
		this._resources = (new RandomResources(3 * nbRings * (nbRings - 1) + 1))[Symbol.iterator]();

		this.generate(nbRings);
	}

	forEachTile(cbk) {
		for (let tile of this._tiles.values()) {
			cbk(tile);
		}
	}

	forEachCity(cbk) {
		for (let city of this._cities.values()) {
			cbk(city);
		}
	}

	forEachPath(cbk) {
		for (let path of this._paths.values()) {
			cbk(path);
		}
	}

	/**
	 * Generates all the content once for all.
	 */
	generate(nbRings) {
		var previousRing = [ this.createTile(0, 0) ];
		for (let ring = 2; ring <= nbRings; ring += 1) {
			let newRing = [];
			for (let tile of previousRing) {
				newRing = newRing.concat(this.createSurroundingTiles(tile));
			}

			previousRing = newRing;
		}
	}

	/**
	 * Creates tiles surrounding a certain tile.
	 * @param  {Tile} center center tile
	 */
	createSurroundingTiles(center) {
		var newTiles = [];
		geo.SURROUNDING_TILES.forEach(function(location) {
			var [x, y] = location;

			var tile = this.createTile(center.location.x + x, center.location.y + y);

			if (tile !== null) {
				newTiles.push(tile);
			}
		}, this);

		return newTiles;
	}

	createTile(x, y) {
		var tile = new Tile(x, y);
		var tileHash = tile.location.hashCode();

		if (!this._tiles.has(tileHash)) {
			// Give the tile its resource and dice value
			tile.resource = this._resources.next().value;
			if (tile.resource !== 'desert') {
				tile.diceValue = this._diceValues.next().value;
			}

			let firstCity = null;
			let lastCity = null;
			for (let [cityX, cityY] of geo.SURROUNDING_CITIES) {
				let city = this.createCity(x + cityX, y + cityY);
				tile.addCity(city);

				if (firstCity === null) {
					firstCity = city;
					lastCity = city;
				} else {
					this.createPath(lastCity, city);
					lastCity = city;
				}
			}
			// Build path from the last to the first city
			this.createPath(lastCity, firstCity);

			this._tiles.set(tileHash, tile);

			return tile;
		} else {
			return null;
		}
	}

	createCity(x, y) {
		var cityHash = new Location(x, y).hashCode();
		var city;
		if (this._cities.has(cityHash)) {
			city = this._cities.get(cityHash);
		} else {
			city = new City(x, y);
			this._cities.set(cityHash, city);
		}

		return city;
	}

	createPath(from, to) {
		var path = new Path(from.location, to.location);
		this._paths.set(path.hashCode(), path);

		return path;
	}
}