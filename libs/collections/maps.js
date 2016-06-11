/* exported entries */
import _ from 'lodash';

/**
 * Provides a generator over the entries of an object.
 * @param {Object} obj the object to iterate
 */
export function* entries(obj) {
	for (let key of Object.keys(obj)) {
		yield [key, obj[key]];
	}
}

export function object(values, iteratee, thisArg) {
	var result = {};
	_.forEach(values, function(value, key) {
		const [k, v] = iteratee.call(thisArg, value, key);
		result[k] = v;
	});

	return result;
}

export function defaultValue(map, key) {
	return map[key] || 0;
}

export function increment(map, key, value) {
	map[key] = defaultValue(map, key) + value;
}

export function min(map, key, value) {
	if (_.isNumber(value)) {
		map[key] = Math.min(defaultValue(map, key), value);
	}
}
