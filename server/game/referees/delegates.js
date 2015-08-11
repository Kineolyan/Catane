import * as map from 'libs/collections/maps.js';

/**
 * Delegate class handling dropping of rsources for all players
 * after a 7 has been rolled.
 */
export class DropResourcesDelegate {
	constructor(referee) {
		this._referee = referee;
		this._players = new Map();

		for (let player of this._referee.players) {
			let resCount = this.countResources(player.resources);
			let resToDrop = resCount > 7 ? Math.floor(resCount / 2) : 0;

			if (resToDrop > 0) { this._players.set(player.id, resToDrop); }
		}
	}

	get referee() {
		return this._referee;
	}

	get remainingList() {
		var mapping = {};
		for (let [id, count] of this._players) { mapping[id] = count; }
		return mapping;
	}

	/**
	 * Drops the asked resources from the player.
	 * @param {Player} player the player dropping the resources
	 * @param {Object} resources the resources to drop
	 * @return {Number} the number of resources remaining to drop
	 * @throws Error if the player does not own the resources to drop
	 *  or if he/she is dropping to much resources
	 */
	dropResources(player, resources) {
		if (player.hasResources(resources)) {
			var resCount = this.countResources(resources);
			var remaining = this._players.get(player.id);

			if (resCount <= remaining) {
				player.useResources(resources);
				remaining -= resCount;
				if (remaining === 0) {
					this._players.delete(player.id);
				} else {
					this._players.set(player.id, remaining);
				}
				return remaining;
			} else {
				throw new Error(`Player ${player.id} cannot drop too many resources`);
			}
		} else {
			throw new Error(`Player ${player.id} has not enough resources`);
		}
	}

	countResources(resources) {
		var resCount = 0;
		for (let [, count ] of map.entries(resources)) {	resCount += count; }
		return resCount;
	}

	/**
	 * Gets if all resources have been dropped by every player.
	 * If false, use @remainingList to get the players with remaining resources to drop.
	 * @return {boolean} true if all resources have been dropped
	 */
	allResourcesDropped() {
		for (let count of this._players.values()) {
			if (count !== 0) { return false; }
		}
		return true;
	}

	/* -- Additional methods to act as a referee -- */

	checkTurn() {
		throw new Error('Dropping resources. No turn to check');
	}
}