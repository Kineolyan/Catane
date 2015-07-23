import tests from 'client/js/components/libs/test';

import React from 'react/addons'; // eslint-disable-line no-unused-vars

import { PlayersBinding } from 'client/js/components/common/players';
import PlayersInfo from 'client/js/components/parts/GameInterface/PlayersInfo/PlayersInfo.react';
import Deck from 'client/js/components/parts/GameInterface/PlayersInfo/Deck.react';
import PlayerInfo from 'client/js/components/parts/GameInterface/PlayersInfo/PlayerInfo.react';
import OtherPlayerInfo from 'client/js/components/parts/GameInterface/PlayersInfo/OtherPlayerInfo.react';

class TestRoot extends tests.Wrapper {
	render() {
		return (<PlayersInfo binding={{ default: this.binding.sub('players'), me: this.binding.sub('me') }} />);
	}
}

describe('<PlayersInfo>', function() {

	beforeAll(function() {
		this._ctx = tests.getCtx();

		var binding = this._ctx.getBinding();
		var players = new PlayersBinding(binding.get('players'));

		players.deleteAll();
		players.setIPlayer(1, 'tom', 'green');
		players.setPlayer(2, 'bob', 'yellow');
		players.setPlayer(3, 'lolo', 'blue');
		binding.set('players', players.binding);

		this.info = tests.bootstrap(this._ctx, TestRoot);
	});

	it('should have a deck of cards', function() {
		expect(tests.getRenderedElements(this.info, Deck).length).toEqual(1);
	});

	it('renders my information', function() {
		expect(tests.getRenderedElements(this.info, PlayerInfo)).toHaveLength(1);
	});

	it('renders the other players', function() {
		expect(tests.getRenderedElements(this.info, OtherPlayerInfo)).toHaveLength(2);
	});

});