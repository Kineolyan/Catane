export default class Dice {
	constructor(nbOfFaces) {
		this.nbOfFaces = nbOfFaces;
	}

	roll() {
		return Math.ceil(Math.random() * this.nbOfFaces);
	}
}

// module.exports.Dice = Dice;