export class Plays {
	constructor() {

	}

	register(player) {
		var game = player.game;

		player.on('play:roll-dice', () => {
			var diceValues = player.game.rollDice(player);
			game.emit('play:roll-dice', { diceValues: diceValues });

			return undefined;
		});

		player.on('play:turn:end', () => {
			var nextPlayer = player.game.endTurn(player);
			game.emit('play:turn:new', { player: nextPlayer.id });

			return undefined;
		});
	}

	unregister(player) {}
}

export default Plays;