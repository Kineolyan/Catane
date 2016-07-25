import Mixin from 'libs/mixins';

import { Resources } from 'server/sewen/elements/cards/cards';
import { Side } from 'server/sewen/game/players/SewenPlayer';
import { DEFAULT_COST, checkSide } from 'server/sewen/elements/cards/CostMixins';

class DiscountEffect extends Mixin {
	static get name() {
		return 'discount';
	}

	constructor(resourceType, direction, cost) {
		super('DiscountEffect');
		const attributes = {
			_resources: new Set(
				resourceType === 'raw' ?
					[Resources.ARGILE, Resources.PIERRE, Resources.BOIS, Resources.MINERAI] :
					[Resources.VERRE, Resources.TISSU, Resources.PAPIER]
			),
			_direction: direction === 'both' ? null : Side[direction.toUpperCase()],
			_cost: parseInt(cost, 10)
		};
		if (attributes._direction !== null) {
			checkSide(attributes._direction);
		}

		this.initialize(card => {
			Object.assign(card, attributes);
		}).withMethods({
			getCostFor(resource, side) {
				const isSideOk = this._direction === null || this._direction === side;
				return isSideOk && this._resources.has(resource) ? this._cost : DEFAULT_COST;
			}
		});
	}
}

export default DiscountEffect;
