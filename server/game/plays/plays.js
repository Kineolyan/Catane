import Location from '../../elements/geo/location';
import Path from '../../elements/geo/path';

export class Plays {
	constructor() {}

	register(player) {
		player.on('play:pick:colony', (request) => {
			var location = new Location(request.colony.x, request.colony.y);
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
			var fromLocation = new Location(request.path.from.x, request.path.from.y);
			var toLocation = new Location(request.path.to.x, request.path.to.y);
			var pickedPath = player.game.pickPath(player, new Path(fromLocation, toLocation));

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
			var tileLocation = new Location(request.tile.x, request.tile.y);
			player.game.moveThieves(player, tileLocation);
			player.game.emit('play:move:thieves', { tile: tileLocation.toJson() });
			return undefined;
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