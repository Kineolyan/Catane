import _ from 'lodash';

import { Resources } from 'server/sewen/elements/cards/cards';
import Mixin from 'libs/mixins';

class Cost {
	constructor(wanted) {
		this._wanted = _.clone(wanted);
		this._resources = new Set(_.keys(this._wanted));
	}

	gain(resource, value) {
		if (this._resources.has(resource)) {
			this._wanted[resource] -= value;
		}
	}

	isPaid() {
		return _.every(this._wanted, gain => gain <= 0);
	}
}

export const EmptyMixin = new Mixin('EmptyResourceMixin')
	.withMethods({
		canProvide() {
			return false;
		},
		getCostFor() {
			throw new Error(`${this.name} cannot provide resources`);
		}
	});

export const ResourcesMixin = new Mixin('ResourcesMixin')
	.withMethods({
		canProvide(resources) {
			const cost = _.reduce(this.gains, (cost, gain, resource) => {
				cost.gain(resource, gain);
				return cost;
			}, new Cost(resources));

			return cost.isPaid();
		}
	});

export const MixedResourceMixin = new Mixin('MixedResourceMixin')
	.initialize(card => {
		const gainedResources = _.keys(card.gains);
		const resource = parseInt(gainedResources[0], 10);
		card._gain = card.gains[resource];
		if (card._gain === 1 && gainedResources.length === 1) {
			card._mixedResources = new Set(Resources.decompose(resource).map(v => v.toString()));
		} else if (card._gain !== 1) {
			throw new Error(`Mixed resources only supported with a gain of 1`);
		} else {
			throw new Error(`Mixed resources only supported for one gain`);
		}
	})
	.withMethods({
		canProvide(resources) {
			if (_.size(resources) === 1) {
				const wantedResource = _.keys(resources)[0];
				return this._mixedResources.has(wantedResource)
					&& resources[wantedResource] === 1;
			} else {
				return false;
			}
		}
	});

export default function(definition) {
	const gains = _.keys(definition.gains);
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