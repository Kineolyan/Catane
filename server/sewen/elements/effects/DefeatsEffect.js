import Mixin from 'libs/mixins';

class DefeatsEffect extends Mixin {
	static get name() {
		return 'defeats';
	}

	constructor() {
		super(this.constructor.name);
		this.initialize(card => card)
			.withMethods({});
	}
}

export default DefeatsEffect;