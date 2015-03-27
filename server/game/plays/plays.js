export class Plays {
	constructor() {}

	register(player) {
		player.on('play:roll-dice', () => {
			var diceValues = player.game.rollDice(player);
			player.game.emit('play:roll-dice', { dice: diceValues });

			return undefined;
		});

		player.on('play:turn:end', () => {
			var nextPlayer = player.game.endTurn(player);
			player.game.emit('play:turn:new', { player: nextPlayer.id });

			return undefined;
		});
	}

	unregister(player) {}
}

export default Plays;