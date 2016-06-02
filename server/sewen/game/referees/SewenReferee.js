import _ from 'lodash';

import { Side } from 'server/sewen/game/players/SewenPlayer';

export class SewenReferee {
	failRule(message) {
		throw new Error(message);
	}

	getPlayer(player, side) {
		return side === Side.OWN ? player : player.getNeighbour(side);
	}

	playCard(player, card, order) {
		this.failIf(`Player ${player.name} already has ${card.name}`, player.hasCard(card.name));

		if (player.canGain(card.name)) {
			return true;
		}

		// Check the cards exist
		_.forEach(order, ({ side, usedCard } ) => {
			if (!this.getPlayer(side).hasCard(usedCard.name)) {
				this.failRule(`Player ${this.getPlayer(side).name} does not own card ${usedCard.name}`);
			}
		});

		// Check that the order can be fulfilled
		_.forEach(order, ({  card: usedCard, usage }) => {
			if (usedCard.canProvide(usage)) {
				this.failRule(`Card ${usedCard.name} cannot provide ${usage}`);
			}
		});

		// Check that the player can afford the card
		const cost = _.sum(order, ({ usage, side, usedCard }) => usedCard.getCostFor(usage, side));
		if (player.coins < cost) {
			this.failRule(`Player ${player.name} cannot afford the order. Costing ${cost} while owing ${player.coins}`);
		}
	}

	failIf(message, condition) {
		if (condition) {
			this.failRule(message);
		}
	}
}

export default SewenReferee;