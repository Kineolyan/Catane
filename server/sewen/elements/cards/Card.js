import _ from 'lodash';
import { effects } from 'server/sewen/elements/effects/effects';
import getResourcesMixin from 'server/sewen/elements/cards/ResourceMixins';
import getWarMixin from 'server/sewen/elements/cards/WarMixins';
import getCostMixin from 'server/sewen/elements/cards/CostMixins';

export class Card {
	constructor(name, definition) {
		this._name = name;
		this._definition = definition;
	}

	get name() {
		return this._name;
	}

	get ages() {
		return this._definition.quantity.map(q => q.age);
	}

	get cost() {
		return this._definition.cost;
	}

	get gains() {
		return this._definition.gains;
	}

	getCountFor(nbPlayers, age) {
		const ageQuantity = this._definition.quantity.find(q => q.age === age);
		if (ageQuantity !== undefined) {
			return _(ageQuantity.range)
				.filter(minNb => minNb <= nbPlayers)
				.size();
		} else {
			return 0;
		}
	}

	// /**
	//  * Decides if a player can acquire this card.
	//  * @param {SewenPlayer} player player to consider
	//  * @returns {boolean|String} true if possible, the reason otherwise
	//  */
	// canBeAcquiredBy(player) {
	// 	// Prevent duplicates
	// 	if (player.hasCard(this._name)) {
	// 		return 'Owned by user';
	// 	}
	//
	// 	// Check for automatic build
	// 	const requirement = this._definition.requires;
	// 	if (requirement !== undefined && player.hasCard(requirement)) {
	// 		return true;
	// 	}
	//
	// 	// Check for resources
	// 	// FIXME phase still to define
	// 	return player.hasResources(this._definition.cost) ?
	// 		true : 'Not enough resources';
	// }
}

export function makeCard(name, definition) {
	const card = new Card(name, definition);

	const mixins = [
		getResourcesMixin(definition),
		getWarMixin(definition),
		getCostMixin(definition)
	];
	// Effect mixin
	if (definition.effect) {
		mixins.push(effects.get(this._definition.effect));
	}
	mixins.forEach(mixin => mixin.mixWith(card));

	return card;
}

