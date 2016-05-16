import { makeEnum } from 'libs/enum';

const Directions = makeEnum(['LEFT', 'RIGHT', 'BOTH']);

export default class DiscountEffect {
	static get name() {
		return 'discount';
	}

	constructor(resourceType, direction, cost) {
		this._resourceType = resourceType;
		this._direction = Directions[direction.toUpperCase()];
		this._cost = parseInt(cost, 10);
	}
}