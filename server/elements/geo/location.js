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
}