/* exported entries */
/**
 * Provides a generator over the entries of an object.
 * @param obj the object to iterate
 */
export function* entries(obj) {
	for (let key of Object.keys(obj)) {
		yield [key, obj[key]];
	}
}
