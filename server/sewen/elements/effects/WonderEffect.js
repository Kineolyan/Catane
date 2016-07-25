import Mixin from 'libs/mixins';

class WonderEffect extends Mixin {
	static get name() {
		return 'wonder';
	}

	constructor() {
		super(this.constructor.name);
		this.initialize(card => card)
			.withMethods({});
	}
}

export default WonderEffect;