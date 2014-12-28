/**
 * Class representing a dice, or many dice, with as many faces as wanted.
 */
export default class Dice {
	constructor(nbOfFaces) {
		this.nbOfFaces = nbOfFaces;
	}
	/**
	 * Rolls the dice
	 */
	roll() {
		return Math.ceil(Math.random() * this.nbOfFaces);
	}
}

// module.exports.Dice = Dice;

