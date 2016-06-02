import _ from 'lodash';

import { Resources } from 'server/sewen/elements/cards/cards';

// class ForkedCost {
// 	constructor(resources) {
// 		this._resources = resources;
// 		this._gains = [];
// 		this._forks = [];
// 	}
//
// 	gain(resource, value) {
// 		if (this._resources.has(resource)) {
// 			this._gains[resource] = value;
// 		}
// 	}
//
// 	fork() {
// 		const fork = new ForkedCost(this._resources);
// 		this._forks.push(fork);
// 		return fork;
// 	}
// }

class Cost {
	constructor(wanted) {
		this._wanted = _.clone(wanted);
		this._resources = new Set(_.keys(this._wanted));
		// this._forks = [];
	}

	gain(resource, value) {
		if (this._resources.has(resource)) {
			this._wanted[resource] -= value;
		}
	}

	// fork() {
	// 	const fork = new ForkedCost(this._resources);
	// 	this._forks.push(fork);
	// 	return fork;
	// }

	isPaid() {
		return _.every(this._wanted, gain => gain <= 0);
	}
}

export const EmptyMixin = {
	setUp() {},
	methods: {
		canProvide() {
			return false;
		},
		getCostFor() {
			throw new Error(`${this.name} cannot provide resources`);
		}
	}
};

export const ResourcesMixin = {
	setUp() {},
	methods: {
		canProvide({ resources }) {
			const cost = _.reduce(this.gains, (cost, gain, resource) => {
				cost.gain(resource, gain);
				return cost;
			}, new Cost(resources));

			return cost.isPaid();
		},
		getCostFor(usage) {
			return _.sum(usage);
		}
	}
};

export const MixedResourceMixin = {
	setUp(card) {
		const resource = _.keys(card.gains)[0];
		card._mixedResources = new Set(Resources.decompose(resource));
		card._gain = card.gains[resource];
	},
	methods: {
		canProvide({ resources }) {
			const cost = new Cost(resources);
			const wantedResource = _.keys(resources)[0];
			if (_.includes(this._mixedResources, wantedResource)) {
				cost.gain(wantedResource, this._gain);
			}

			return cost.isPaid();
		},
		getCostFor(usage) {
			return _.sum(usage);
		}
	}
};

// Do something for effects
// export const EffectCard = {
// 	setUp(card) {
// 		if (card._definition.effect !== undefined) {
// 			card._effect = effects.get(this._definition.effect);
// 		} else {
// 			throw new Error(`Card ${name} (${definition} has no effect`);
// 		}
// 	},
// 	methods: {
// 		canProvide({ resources, fee }) {
// 			return false;
// 		}
// 	}
// }

export default function(definition) {
	const gains = _.size(definition.gains);
	if (gains.length === 0) {
		return EmptyMixin;
	} else if (gains.length > 1) {
		return ResourcesMixin;
	} else {
		// Choose between mixed or single resource
		const singleResource = gains[0];
		return Resources.isValue(singleResource) ? ResourcesMixin : MixedResourceMixin;
	}
}