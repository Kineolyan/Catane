import Mixin from 'libs/mixins';

class ScoreAndCoinsEffect extends Mixin {
	static get name() {
		return 'scoreAndCoins';
	}

	constructor() {
		super(this.constructor.name);
		this.initialize(card => card)
			.withMethods({});
	}
}

export default ScoreAndCoinsEffect;