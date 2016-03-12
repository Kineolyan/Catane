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

	register(user) {
		user.on('play:pick:colony', (request) => {
			var location = getColonyLocation(request);
			var player = user.player;
			var game = player.game;
			var colony = game.pickColony(player, location);

			var message = {
				player: player.id,
				colony: colony.location.toJson()
			};
			game.emit(player, 'play:pick:colony', message);

			// Add the resources for the player
			message.resources = player.resources;
			return message;
		});

		user.on('play:pick:path', (request) => {
			var askedPath = getPath(request);
			var player = user.player;
			var pickedPath = player.game.pickPath(player, askedPath);

			player.game.emit('play:pick:path', {
				player: player.id,
				path: pickedPath.toJson()
			});

			return undefined;
		});

		user.on('play:roll-dice', () => {
			var player = user.player;
			var game = player.game;
			var diceValues = game.rollDice(player);

			for (let p of game.players) {
				if (p.id !== player.id) { p.emit('play:roll-dice', { dice: diceValues, resources: p.resources }); }
			}

			return { dice: diceValues, resources: player.resources };
		});

		user.on('play:move:thieves', (request) => {
			var tileLocation = getTileLocation(request);
			var player = user.player;
			player.game.moveThieves(player, tileLocation);
			player.game.emit('play:move:thieves', { tile: tileLocation.toJson() });
			return undefined;
		});

		user.on('play:add:colony', (request) => {
			var location = getColonyLocation(request);
			var player = user.player;
			var addedColony = player.game.settleColony(player, location);

			var message = { player: player.id, colony: addedColony.location.toJson() };
			player.game.emit(player, 'play:add:colony', message);

			// Update the resources for the current player
			message.resources = player.resources;
			return message;
		});

		user.on('play:add:road', (request) => {
			var path = getPath(request);
			var player = user.player;
			var builtRoad = player.game.buildRoad(player, path);

			var message = { player: player.id, path: builtRoad.toJson() };
			player.game.emit(player, 'play:add:road', message);

			// Update the resources for the current player
			message.resources = player.resources;
			return message;
		});

		user.on('play:evolve:city', (request) => {
			var location = getCityLocation(request);
			var player = user.player;
			var builtCity = player.game.buildCity(player, location);

			var message = { player: player.id, colony: builtCity.location.toJson() };
			player.game.emit(player, 'play:evolve:city', message);

			// Update the resources for the current player
			message.resources = player.resources;
			return message;
		});

		user.on('play:resources:drop', resources => {
			var player = user.player;
			var remaining = player.game.dropResources(player, resources);

			return { resources: player.resources, remaining: remaining };
		});

		user.on('play:resources:convert', ({ from: from, to: to })=> {
			var player = user.player;
			player.game.convertResources(player, from, to);

			return { resources: player.resources };
		});

		user.on('play:resources:offer', ({ to: other, give: givenResources, receive: gottenResources }) => {
			var id = this._exchangeIds();
			var player = user.player;
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

		user.on('play:resources:exchange', ({ id: exchangeId, status: status }) => {
			var exchange = this._exchanges.get(exchangeId);
			if (exchange === undefined) {
				throw new Error(`Unexisting exchange ${exchangeId}`);
			}

			var player = user.player;
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
				} };
				otherPlayer.emit('play:resources:exchange', message);
				return message;
			}
		});

		user.on('play:card:buy', function() {
			const player = user.player;
			return player.game.buyCard(player);
		});

		user.on('play:card:use', function({ card: { id: cardId, args } }) {
			const player = user.player;
			return player.game.playCard(player, cardId, args);
		});

		user.on('play:turn:end', () => {
			var player = user.player;
			var nextPlayer = player.game.endTurn(player);
			player.game.emit('play:turn:new', { player: nextPlayer.id });

			return undefined;
		});
	}

	unregister() {}
}

export default Plays;
