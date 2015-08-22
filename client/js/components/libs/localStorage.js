export class LocalStorage {
	constructor() {
		this._storage = window.localStorage;
	}

	get(key) {
		var value = this._storage[key];
		return value !== undefined ? JSON.parse(value) : undefined;
	}

	set(key, value) {
		this._storage[key] = JSON.stringify(value);
	}

	remove(key) {
		this._storage.removeItem(key);
	}
}

export default LocalStorage;