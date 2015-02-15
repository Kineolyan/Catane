/* exported catane */
/* Manual define exports since JS Hint does not handle well generators */

const DICE_DISTRIBUTION = [ 11, 3, 6, 5, 4, 9, 10, 8, 4, 11, 12, 9, 10, 8, 3, 6, 2, 5 ];

/**
 * Creates a new array with given values in randome order
 * @param  {[Array]} values values to randomize
 * @return {[Array]} array of values in random order
 */
function shuffle(values) {
  var currentIndex = values.length, randomIndex ;
  var array = [];

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    array[currentIndex] = values[randomIndex];
    array[randomIndex] = values[currentIndex];
  }

  return array;
}

export function *catane() {
	var values = DICE_DISTRIBUTION;
	var index = 0;
	for (;;) {
		if (index >= values.length) {
			values = shuffle(DICE_DISTRIBUTION);
			index = 0;
		}

		yield values[index];
		index += 1;
	}
}