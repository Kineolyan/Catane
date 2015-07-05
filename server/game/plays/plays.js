import Location from 'server/elements/geo/location';
import Path from 'server/elements/geo/path';
import { idGenerator } from 'server/game/util';

function getTileLocation(request) {
	return new Location(request.tile.x, request.tile.y);
}

function getColonyLocation(request) {
	return new Location(request.colony.x, request.colony.y);
}

function getCityLocation(request) {
	return new Location(request.city.x, request.city.y);
}

function getPath(request) {
	var fromLocation = new Location(request.path.from.x, request.path.from.y);
	var toLocation = new Location(request.path.to.x, request.path.to.y);
	return new Path(fromLocation, toLocation);
}

export class Plays {
	constructor() {
		this._exchanges = new Map();
		this._exchangeIds = idGenerator();
	}

	register(player) {
		player.on('play:pick:colony', (request) => {
			var location = getColonyLocation(request);
			var colony = player.game.pickColony(player, location);

			var message = {
				player: player.id,
				colony: colony.location.toJson()
			};
			player.game.emit(player, 'play:pick:colony', message);

			// Add the resources for the player
			message.resources = player.resources;
			return message;
		});

		player.on('play:pick:path', (request) => {
			var askedPath = getPath(request);
			var pickedPath = player.game.pickPath(player, askedPath);

			player.game.emit('play:pick:path', {
				player: player.id,
				path: pickedPath.toJson()
			});

			return undefined;
		});

		player.on('play:roll-dice', () => {
			var diceValues = player.game.rollDice(player);

			for (let p of player.game.players) {
				if (p.id !== player.id) { p.emit('play:roll-dice', { dice: diceValues, resources: p.resources }); }
			}

			return { dice: diceValues, resources: player.resources };
		});

		player.on('play:move:thieves', (request) => {
			var tileLocation = getTileLocation(request);
			player.game.moveThieves(player, tileLocation);
			player.game.emit('play:move:thieves', { tile: tileLocation.toJson() });
			return undefined;
		});

		player.on('play:add:colony', (request) => {
			var location = getColonyLocation(request);
			var addedColony = player.game.settleColony(player, location);

			var message = { player: player.id, colony: addedColony.location.toJson() };
			player.game.emit('play:add:colony', player, message);

			// Update the resources for the current player
			message.resources = player.resources;
			return message;
		});

		player.on('play:add:road', (request) => {
			var path = getPath(request);
			var builtRoad = player.game.buildRoad(player, path);

			var message = { player: player.id, path: builtRoad.toJson() };
			player.game.emit('play:add:colony', player, message);

			// Update the resources for the current player
			message.resources = player.resources;
			return message;
		});

		player.on('play:evolve:city', (request) => {
			var location = getCityLocation(request);
			var builtCity = player.game.buildCity(player, location);

			var message = { player: player.id, colony: builtCity.location.toJson() };
			player.game.emit('play:evolve:city', player, message);

			// Update the resources for the current player
			message.resources = player.resources;
			return message;
		});

		player.on('play:resources:drop', request => {
			var resources = request.resources;
			var remaining = player.game.dropResources(player, resources);

			return { resources: player.resources, remaining: remaining };
		});

		player.on('play:resources:convert', ({ from: from, to: to })=> {
			player.game.convertResources(player, from, to);

			return { resources: player.resources };
		});

		player.on('play:resources:offer', ({ to: other, give: givenResources, receive: gottenResources }) => {
			var id = this._exchangeIds();
			this._exchanges.set(id, { from: player.id, to: other, give: givenResources, receive: gottenResources });

			// Send the request to the other player
			var otherPlayer = player.game.getPlayer(other);
			if (otherPlayer !== null) {
				otherPlayer.emit('play:resources:offer', { exchange: {
					id: id,
					from: player.id,
					give: gottenResources,
					receive: givenResources
				} });
			} else {
				throw new Error(`Player ${other} does not exist`);
			}

			return { exchange: { id: id } };
		});

		player.on('play:resources:exchange', ({ id: exchangeId, status: status }) => {
			var exchange = this._exchanges.get(exchangeId);
			if (exchange === undefined) {
				throw new Error(`Unexisting exchange ${exchangeId}`);
			}
			if (exchange.to !== player.id) {
				throw new Error(`Wrong receiver (${player.id}). This exchange is from ${exchange.from} to ${exchange.to}`);
			}

			var otherPlayer = player.game.getPlayer(exchange.from);
			if (status === 'accept') {
				player.game.exchangeResources(otherPlayer, player, exchange.give, exchange.receive);

				// Remove the exchange from the list
				this._exchanges.delete(exchangeId);

				// Sends the updates to the players
				var exchangeStatus = { id: exchangeId, status: 'done' };
				otherPlayer.emit('play:resources:exchange', {
					resources: otherPlayer.resources,
					exchange: exchangeStatus
				});
				return {
					resources: player.resources,
					exchange: exchangeStatus
				};
			} else if (status === 'reject') {
				// Remove the exchange from the list
				this._exchanges.delete(exchangeId);

				// Notifies both players
				var message = { exchange: {
					id: exchangeId,
					status: 'cancelled'
				}};
				otherPlayer.emit('play:resources:exchange', message);
				return message;
			}
		});

		player.on('play:turn:end', () => {
			var nextPlayer = player.game.endTurn(player);
			player.game.emit('play:turn:new', { player: nextPlayer.id });

			return undefined;
		});
	}

	unregister() {}
}

export default Plays;