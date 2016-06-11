import { Resources } from 'server/sewen/elements/cards/cards';
import Mixin from 'libs/mixins';

export const EmptyMixin = new Mixin('EmptyWarMixin')
	.withMethods({
		getWarPrice() {
			return 0;
		}
	});

export const WarMixin = new Mixin('WarMixin')
	.withMethods({
		getWarPrice() {
			return this.gains[Resources.ARME];
		}
	});

export default function (definition) {
	const gain = definition.gains || {};
	return (gain[Resources.ARME] || 0) > 0 ? WarMixin : EmptyMixin;
}