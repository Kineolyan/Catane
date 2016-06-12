import Mixin from 'libs/mixins';
import { assert } from 'libs/assertions';
import { Side } from 'server/sewen/game/players/SewenPlayer';

export const DEFAULT_COST = 2;

export function checkSide(side) {
	assert(side in Side, `Side ${side} does not exist`);
	assert(Side.OWN !== side, 'Cannot call for OWN side');
}

export const DefaultMixin = new Mixin('DefaultCostMixin')
	.withMethods({
		getCostFor(resource, side) {
			checkSide(side);
			return DEFAULT_COST;
		}
	});

export default function() {
	return DefaultMixin;
}