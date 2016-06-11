import Mixin from 'libs/mixins';

export const DefaultMixin = new Mixin('DefaultCostMixin')
	.withMethods({
		getCostFor() {
			return 2;
		}
	});

export default function() {
	return DefaultMixin;
}