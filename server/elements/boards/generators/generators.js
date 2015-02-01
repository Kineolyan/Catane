import Tile from '../../geo/tile';

export class RoundGenerator {
	constructor(nbRings) {
		this._tiles = new Map();

		this.generate(nbRings);
	}

	forEachTile(cbk) {
		for (let tile of this._tiles.values()) {
			cbk(tile);
		}
	}

	forEachCity() {}

	forEachPath() {}

	/**
	 * Generates all the content once for all.
	 */
	generate(nbRings) {
		var previousRing = [ this.createTile(0, 0, 'tuile') ];
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
		[
			[0, 0], [1, 1], [2, -1], [1, -2], [-1, -1], [-2, 1], [-1, 2]
		].forEach(function(location) {
			var [x, y] = location;

			var tile = this.createTile(center.location.x + x, center.location.y + y, 'tuile');

			if (tile !== null) {
				newTiles.push(tile);
			}
		}, this);

		return newTiles;
	}

	createTile(x, y, resource) {
		var tile = new Tile(x, y, resource);
		var tileHash = tile.location.hashCode();

		if (!this._tiles.has(tileHash)) {
			this._tiles.set(tileHash, tile);

			return tile;
		} else {
			return null;
		}
	}
}