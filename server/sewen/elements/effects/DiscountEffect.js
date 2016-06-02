import {makeEnum} from 'libs/enum';

const Directions = makeEnum(['LEFT', 'RIGHT', 'BOTH']);
import {Resources} from 'server/sewen/elements/cards/cards';

export default {
	name() {
		return 'discount';
	},
	setUp(card, resourceType, direction, cost) {
		card._resources = new Set(
			resourceType === 'raw' ?
				[Resources.ARGILE, Resources.PIERRE, Resources.BOIS, Resources.MINERAI] :
				[Resources.VERRE, Resources.TISSU, Resources.PAPIER]
		);
		card._direction = Directions[direction.toUpperCase()];
		card._cost = parseInt(cost, 10);
	},
	methods: {
		getCostFor(usage, side) {
			// Ensure that all resources are of the resourceType
			if (this._direction === side && _.every(usage, (count, resource) => this._resources.has(resource))) {
				return this._cost * _.sum(usage);
			} else if (this._direction !== side) {
				throw new Error(`Invalid direction to pay for. Expect ${this._direction} but got ${side}`);
			} else {
				throw new Error(`Invalid resources to be paid: ${usage}`);
			}
		}
	}
};