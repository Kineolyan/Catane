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
		const [v, k] = iteratee.call(thisArg, value, key);
		result[k] = v;
	});

	return result;
}
