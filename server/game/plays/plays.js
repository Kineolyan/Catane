import Location from '../../elements/geo/location';
import Path from '../../elements/geo/path';

export class Plays {
	constructor() {}

	register(player) {
		player.on('play:pick:colony', (request) => {
			var location = new Location(request.colony.x, request.colony.y);
			var colony = player.game.pickColony(player, location);

			player.game.emit('play:pick:colony', {
				player: player.id,
				colony: colony.location.toJson()
			});

			return undefined;
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
			player.game.emit('play:roll-dice', { dice: diceValues });

			return undefined;
		});

		player.on('play:move:thieves', () => {
			player.game.moveThieves(player);
			// TODO complete the implementation

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