import Immutable from 'immutable';

import * as maps from 'libs/collections/maps';

/**
 * Helper wrapping a binding of the personal information.
 * This provides utilities to add cards, ...
 */
export class MyBinding {
	constructor(binding) {
		this._binding = binding;
	}

	/**
	 * Creates an instance from the top-level binding looking for 'me'.
	 * @param {Object} binding the top-level binding
	 * @return {MyBinding} an instance
	 */
	static from(binding) {
		return new MyBinding(binding.get('me'));
	}

	get binding() {
		return this._binding;
	}

	/**
	 * Saves the internal binding into the global one
	 * @param {Object} binding the global binding representation
	 *  This could be a Binding or a TransactionContext
	 * @return {*} the global binding
	 */
	save(binding) {
		return binding.set('me', this._binding);
	}

	/**
	 * Gives the cards to the players
	 * @param {Object} cards map of cards as [resource]=count
	 */
	giveCards(cards) {
		var resources = this._binding.get('resources').withMutations(binding => {
			for (let [resource, count] of maps.entries(cards)) {
				for (let i = 0; i < count; i += 1) { binding.push(resource); }
			}
		});
		this._binding = this._binding.set('resources', resources);
	}
}

/**
 * Helper wrapping a binding about players.
 * This allows insert new players, update values, find a player by its id.
 */
export class PlayersBinding {

	constructor(binding) {
		this._binding = binding;
	}

	/**
	 * Creates an instance from the top-level binding looking for 'players'.
	 * @param {Object} binding the top-level binding
	 * @return {MyBinding} an instance
	 */
	static from(binding) {
		return new PlayersBinding(binding.get('players'));
	}

	get binding() {
		return this._binding;
	}

	/**
	 * Saves the internal binding into the global one
	 * @param {Object} binding the global binding representation
	 *  This could be a Binding or a TransactionContext
	 * @return {*} the global binding
	 */
	save(binding) {
		return binding.set('players', this._binding);
	}

	setIPlayer(id, ...args) {
		var player = PlayersBinding.createPlayer(id, ...args);
		player.me = true;
		this.set(id, player);
	}

	setPlayer(id, ...args) {
		var player = PlayersBinding.createPlayer(id, ...args);
		this.set(id, player);
	}

	updatePlayer(id, values) {
		var player = this.getPlayer(id);
		if (player !== null) {
			this._binding = this._binding.update(
					this._binding.findIndex(player => player.get('id') === id),
							player => player.merge(values)
			);
		} else {
			throw new Error(`Player ${id} does not exist`);
		}
	}

	static createPlayer(id, name, color, nbCards) {
		return {
			id: id, name: name,
			color: color,
			nbOfCards: (nbCards || 0)
		};
	}

	set(id, player) {
		var pIdx = null;
		this._binding.forEach((p, i) => {
			if (id === p.get('id')) {
				pIdx = i;
				return false;
			} else {
				return true;
			}
		});

		if (pIdx != null) {
			this._binding = this._binding.set(pIdx, Immutable.fromJS(player));
		} else {
			this._binding = this._binding.push(Immutable.fromJS(player));
		}
	}

	getPlayer(id) {
		var result = this._binding.filter(player => player.get('id') === id);
		return !result.isEmpty() ? result.first() : null;
	}

	getMe() {
		return this._binding.filter(PlayersBinding.isMe).first();
	}

	deleteOthers() {
		this._binding = this._binding.filter(PlayersBinding.isMe);
	}

	deleteAll() {
		this._binding = this._binding.clear();
	}

	static isMe(playerBinding) {
		return playerBinding.get('me') === true;
	}
}