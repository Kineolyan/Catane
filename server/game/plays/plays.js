import Location from '../../elements/geo/location';
import Path from '../../elements/geo/path';

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
	constructor() {}

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

		player.on('play:turn:end', () => {
			var nextPlayer = player.game.endTurn(player);
			player.game.emit('play:turn:new', { player: nextPlayer.id });

			return undefined;
		});
	}

	unregister() {}
}

export default Plays;