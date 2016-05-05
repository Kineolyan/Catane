/* exported catane */
/* Manual define exports since JS Hint does not handle well generators */
import { shuffle } from 'libs/collections/arrays';

const DICE_DISTRIBUTION = [ 11, 3, 6, 5, 4, 9, 10, 8, 4, 11, 12, 9, 10, 8, 3, 6, 2, 5 ];

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