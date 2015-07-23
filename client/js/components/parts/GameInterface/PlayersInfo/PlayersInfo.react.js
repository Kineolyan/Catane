'use strict';

/*
 React component containing all the players informations
 */

import { Group } from 'react-art';

import React from 'react'; // eslint-disable-line no-unused-vars
import Deck from 'client/js/components/parts/GameInterface/PlayersInfo/Deck.react';
import PlayerInfo from 'client/js/components/parts/GameInterface/PlayersInfo/PlayerInfo.react';
import OtherPlayerInfo from 'client/js/components/parts/GameInterface/PlayersInfo/OtherPlayerInfo.react';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';
import { PlayersBinding } from 'client/js/components/common/players';

export default class PlayersInfo extends MoreartyComponent {

	/**
	 * Render the whole map of the game
	 * @return {Object} the rendered element
	 */
	render() {
		var binding = this.getDefaultBinding();

		var players = binding.get();
		var renderedPlayers = players.map((player, index) => {
			var playerBinding = binding.sub(index);

			if (PlayersBinding.isMe(player)) {
				return (<PlayerInfo key={playerBinding.get('id')} binding={playerBinding} index={index}/>);
			} else {
				return (<OtherPlayerInfo key={playerBinding.get('id')} binding={playerBinding} index={index}/>);
			}
		});

		var meBinding = this.getBinding('me');
		const widthDeck = window.innerWidth / 3;
		const heightDeck = 130;
		return (
				<Group x={this.props.x} y={this.props.y}>
					{renderedPlayers.toArray()}
					<Deck binding={meBinding.sub('resources')}
					      width={widthDeck} height={heightDeck}
					      y={binding.get('game.height') - this.props.y - heightDeck}
					      x={(binding.get('game.width')  - widthDeck) / 2 - this.props.x}
					      xParent={this.props.x}/>
				</Group>
		);
	}
}

PlayersInfo.defaultProps = {
	x: 0,
	y: 0
};

PlayersInfo.displayName = 'PlayersInfo';