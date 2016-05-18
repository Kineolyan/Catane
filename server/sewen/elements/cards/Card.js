import _ from 'lodash';
import { Resources } from 'server/sewen/elements/cards/cards';
import { effects } from 'server/sewen/elements/effects/effects';

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

export class Card {
	constructor(name, definition) {
		this._name = name;
		this._definition = definition;
	}

	get name() {
		return this._name;
	}

	get cost() {
		return this._definition.cost;
	}

	get gains() {
		return this._definition.gains;
	}

	/**
	 * Decides if a player can acquire this card.
	 * @param {SewenPlayer} player player to consider
	 * @returns {boolean|String} true if possible, the reason otherwise
	 */
	canBeAcquiredBy(player) {
		// Prevent duplicates
		if (player.hasCard(this._name)) {
			return 'Owned by user';
		}

		// Check for automatic build
		const requirement = this._definition.requires;
		if (requirement !== undefined && player.hasCard(requirement)) {
			return true;
		}

		// Check for resources
		// FIXME phase still to define
		return player.hasResources(this._definition.cost) ?
			true : 'Not enough resources';
	}
}

export class BasicCard extends Card {
	constructor(name, definition) {
		super(name, definition);
	}

	canProvide() {
		return false;
	}
}

export class ResourcesCard extends Card {
	constructor(name, definition) {
		super(name, definition);
	}

	canProvide({ resources }) {
		const cost = _.reduce(this.gains, (cost, gain, resource) => {
			cost.gain(resource, gain);
			return cost;
		}, new Cost(resources));

		return cost.isPaid();
	}
}

export class MixedResourceCard extends Card {
	constructor(name, definition) {
		super(name, definition);

		const resource = _.keys(this.gains)[0];
		this._mixedResources = new Set(Resources.decompose(resource));
		this._gain = this._gain[resource];
	}

	canProvide({ resources }) {
		const cost = new Cost(resources);
		const wantedResource = _.keys(resources)[0];
		if (_.includes(this._mixedResources, wantedResource)) {
			cost.gain(wantedResource, this._gain);
		}

		return cost.isPaid();
	}
}

export class EffectCard extends Card {
	constructor(name, definition) {
		super(name, definition);
		if (this._definition.effect !== undefined) {
			this._effect = effects.get(this._definition.effect);
		} else {
			throw new Error(`Card ${name} (${definition} has no effect`);
		}
	}

	canProvide({ resources, fee }) {
		return false;
	}
}

export function makeCard(name, definition) {
	if (definition.effect) {
		return new EffectCard(name, definition);
	}

	const gains = _.size(definition.gains);
	if (gains.length > 1) {
		return new ResourcesCard(name, definition);
	} else if (gains.length === 0) {
		return new BasicCard(name, definition);
	} else {
		// Choose between mixed or single resource
		const singleResource = gains[0];
		return Resources.isValue(singleResource) ?
			new ResourcesCard(name, definition) : new MixedResourceCard(name, definition);
	}
}

