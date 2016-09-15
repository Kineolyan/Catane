import _ from 'lodash';
import * as maps from 'libs/collections/maps';

import { Side } from 'server/sewen/game/players/SewenPlayer';

export class SewenReferee {
	constructor(game) {
		this._game = game;
	}

	failRule(message) {
		throw new Error(message);
	}

	getPlayer(player, side) {
		return side === Side.OWN ? player : player.getNeighbour(side);
	}

	playCard(player, deck, card, order) {
		if (player.hasCard(card.name)) {
			this.failRule(`Player ${player.name} already has ${card.name}`);
		}

		// Check that the player has the card in his deck
		if (_.find(deck, card) === undefined) {
			this.failRule(`Card ${card.name} not in player ${player.name}'s deck: ${deck.map(c => c.name)}`);
		}

		// canGain is considering the requirement, to check if any card can make it for free
		if (player.canGain(card)) {
			return true;
		}

		// Check the cards exist
		this.checkCards(order);

		// Check that the order can be fulfilled
		this.checkOrder(order);

		// Check that the player can afford the card
		this.checkCost(order, player);
	}

	dropCard(player, deck, card){
		if (_.find(deck, card) === undefined) {
			this.failRule(`Card ${card.name} not in player ${player.name}'s deck: ${deck.map(c => c.name)}`);
		}
	}

	checkCards(order) {
		_.forEach(order, ({ side, usedCard }) => {
			if (!this.getPlayer(side).hasCard(usedCard.name)) {
				this.failRule(`Player ${this.getPlayer(side).name} does not own card ${usedCard.name}`);
			}
		});
	}

	checkOrder(order) {
		_.forEach(order, ({ card: usedCard, usage }) => {
			if (usedCard.canProvide(usage)) {
				this.failRule(`Card ${usedCard.name} cannot provide ${usage}`);
			}
		});
	}

	checkCost(order, player) {
		const counts = _.reduce(order, (counts, { side, usage }) => {
			if (side !== Side.OWN) {
				_.forEach(usage, (count, resource) => maps.increment(counts[side], resource, count));
			}
			return counts;
		}, { [Side.LEFT]: {}, [Side.RIGHT]: {} });
		const resources = _(counts)
			.map((sideResources, side) => Object.keys(sideResources).map(resource => [side, resource]))
			.flatten()
			.value();
		const costs = _.reduce(order, (costs, { usedCard }) => {
			_.forEach(resources, ([side, resource]) => maps.min(costs[side], resource, usedCard.getCostFor(resource, side)));
			return costs;
		}, { [Side.LEFT]: {}, [Side.RIGHT]: {} });
		const totalCost = _.sum(resources, ([side, resource]) => {
			return counts[side][resource] * costs[side][resource];
		});

		if (player.coins < totalCost) {
			this.failRule(`Player ${player.name} cannot afford the order. Costing ${totalCost} while owing ${player.coins}`);
		}
	}
}

export default SewenReferee;
