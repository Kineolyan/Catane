// import Location from './location';
const MAX_COORD = 50;
const HASH_BASE = 101;

function offset(coord) {
	return coord + MAX_COORD;
}

export default class Path {

	constructor(from, to) {
		if (from.x === to.x && from.y === to.y) {
			throw new Error(`cannot create path with from = to: ${from.toString()}`);
		}

		// We order by low x then low y.
		if (from.x < to.x) {
			if (from.y <= to.y) {
				this._from = from;
				this._to = to;
			} else {
				this._from = to;
				this._to = from;
			}
		} else {
			if (from.y < to.y) {
				this._from = from;
				this._to = to;
			} else {
				this._from = to;
				this._to = from;
			}
		}
		this._owner = null;
	}

	get from() {
		return this._from;
	}

	get to() {
		return this._to;
	}

	get owner() {
		return this._owner;
	}

	set owner(owner) {
		this._owner = owner;
		return owner;
	}

	hashCode() {
		return offset(this._from.x) + HASH_BASE * (offset(this._from.y) + HASH_BASE * (offset(this._to.x) + HASH_BASE * offset(this._to.y)));
	}

	toString() {
		return `from (${this._from.toString()} to ${this._to.toString()})`;
	}

	toJson() {
		return { from: this._from.toJson(), to: this._to.toJson() };
	}

}