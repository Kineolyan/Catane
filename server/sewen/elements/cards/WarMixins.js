import { Resources } from 'server/sewen/elements/cards/cards';

export const EmptyMixin = {
	setUp() {},
	methods: {
		getWarPrice() {
			return 0;
		}
	}
};

export const WarMixin = {
	setUp() {},
	methods: {
		getWarPrice() {
			return this.gain()[Resources.ARME];
		}
	}
};

export default function(definition) {
	const gain = definition.gain || {};
	return (gain[Resources.ARME] || 0) > 0 ? WarMixin : EmptyMixin;
}