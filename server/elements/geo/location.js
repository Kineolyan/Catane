export default class Location {
	constructor(x, y) {
		this._x = x;
		this._y = y;
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	hashCode() {
		return this._x + 100 * this._y;
	}

	toString() {
		return `(${this._x}, ${this._y})`;
	}

	toJson() {
		return { x: this._x, y: this._y };
	}

	/**
	 * Creates a shifted location by a given indent.
	 * @param x x shift
	 * @param y y shift
	 */
	shift(x, y) {
		return new Location(this.x + x, this.y + y);
	}
}