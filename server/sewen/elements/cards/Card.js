// import _ from 'lodash';
// import { Resources } from 'server/sewen/elements/cards/cards';
import { effects } from 'server/sewen/elements/effects/effects';

export class Card {
	constructor(name, definition) {
		this._name = name;
		this._definition = definition;
		if (this._definition.effect !== undefined) {
			this._effect = effects.get(this._definition.effect);
		}
	}

	get name() {
		return this._name;
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
		return player.hasResources(this._definition.cost) ?
			true : 'Not enough resources';
	}

	// contribute(cost) {
	// 	if(!(this._effect !== undefined && !_.isEmpty(this._definition.gains))) {
	// 		throw new Error('Card with effects and gains');
	// 	}
	//
	// 	// Use resources
	// 	for (let resource of this._definition.gains) {
	// 		if (Resources.isValue(resource)) {
	// 			if (cost.need(resource)) {
	// 				cost.gain(resource, this._definition.gains[resource]);
	// 			}
	// 		} else {
	// 			const resources = Resources.decompose(resource);
	// 			for (let r of resources) {
	// 				cost.fork().gain(r, this._definition.gains[r]);
	// 			}
	// 		}
	// 	}
	//
	// 	// Use effect
	// 	if (this._effect !== undefined) {
	// 		this._effect.apply(cost);
	// 	}
	//
	// 	return cost;
	// }
	//
	// useResource(resource, result) {
	// 	const resourceGain = this._definition.gains[resource];
	// 	_.forEach(result, resultCost => resultCost[resource] -= resourceGain);
	//
	// 	return result;
	// }
}

