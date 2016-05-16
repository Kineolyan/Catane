import * as maps from 'libs/collections/maps.js';
import { BasePlayerDecorator } from 'server/core/game/players/player.js';

export class CatanePlayer extends BasePlayerDecorator {

	constructor(player) {
		super(player);
		this._resources = {};
		this._cards = {};
	}

	get resources() {
		return this._resources;
	}

	/**
	 * Gets cards owned by this player.
	 * @returns {Object} card map as [<card id>] = <card>
	 */
	get cards() {
		return this._cards;
	}

	toString() {
		return `CatanePlayer '${this._player.name}' [${this._player.id}]`;
	}

	/**
	 * Decides if the given player has enough resources to
	 * comply the given cost.
	 * @param  {Object}  costs the cost of the operation
	 * @return {Boolean} true if everything is ok
	 */
	hasResources(costs) {
		for (let [r, cost] of maps.entries(costs)) {
			if (typeof cost !== 'number' || isNaN(cost)) { throw new TypeError(`Cost '${cost}' is not a number`); }

			let quantity = this._resources[r] || 0;
			if (quantity < cost) { return false; }
		}
		return true;
	}

	/**
	 * Adds new resources to the player belongings.
	 * @param  {Array|Object} resources the new resources as
	 *   an array of resource names or a map giving the number
	 *   per name.
	 */
	receiveResources(resources) {
		if (resources.constructor === Array) {
			for (let resource of resources) {
				this._updateResource(resource, 1);
			}
		} else {
			for (let [resource, value] of maps.entries(resources)) {
				this._updateResource(resource, value);
			}
		}
	}

	/**
	 * Removes resources from the player belongings.
	 * @param  {Array|Object} resources the used resources as
	 *   an array of resource names or a map giving the number
	 *   per name.
	 */
	useResources(resources) {
		if (resources.constructor === Array) {
			for (let resource of resources) {
				this._updateResource(resource, -1);
			}
		} else {
			for (let [resource, value] of maps.entries(resources)) {
				this._updateResource(resource, -value);
			}
		}
	}

	/**
	 * Updates a resource by a given number.
	 * @param {String} resource the resource name
	 * @param {Number} value the value to add to the current
	 * @private
	 */
	_updateResource(resource, value) {
		this._resources[resource] = (this._resources[resource] || 0) + value;
	}

	/**
	 * Adds a card to player collection.
	 * @param {Card} card card item to add
	 */
	addCard(card) {
		this._cards[card.id] = card;
	}

	/**
	 * Uses one of the player's card
	 * @param {String} cardId id of a card
	 * @param {Object} args arguments to pass to prepare card use
	 * @returns {Reply} result of the card use
	 * @throws Error if the card does not exist
	 */
	useCard(cardId, args) {
		const card = this.cards[cardId];
		if (card !== undefined) {
			card.prepare(args);
			const reply = card.applyOn({ player: this, game: this.game });
			delete this._cards[cardId];

			return reply;
		} else {
			throw new Error(`Player ${this.name} has no card ${cardId}`);
		}
	}
}

export default CatanePlayer;