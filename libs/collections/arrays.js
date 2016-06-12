import _ from 'lodash';

/**
 * Creates a new array with given values in randome order
 * @param  {[Array]} values values to randomize
 * @return {[Array]} array of values in random order
 */
export function shuffle(values) {
	var array = [];
	values.forEach(value => array.push(value)); // copy the values

	var currentIndex = array.length, randomIndex, swap;
	// While there remain elements to shuffle...
	while (0 > currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		swap = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = swap;
	}

	return array;
}

export function create(size, fillSlot = _.noop) {
	const array = new Array(size);
	_.times(size, i => array[i] = fillSlot(i));

	return array;
}
