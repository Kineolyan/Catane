import 'client/js/components/libs/test';

import tests from 'client/js/components/libs/test';

import React from 'react/addons'; // eslint-disable-line no-unused-vars
import { Text } from 'react-art';

import { PlayersBinding } from 'client/js/components/common/players';
import PlayerInfo from 'client/js/components/parts/GameInterface/PlayersInfo/PlayerInfo.react';

describe('<PlayerInfo>', function() {
	beforeEach(function() {
		var player = PlayersBinding.createPlayer(1, 'Tom', 'green', 3);
		this.ctx = tests.getCtx(player);
		this.info = tests.bootstrap(this.ctx, PlayerInfo);
	});

	it('displays the player name', function() {
		var texts = tests.getRenderedElements(this.info, Text);
		expect(texts).toHaveLength(1);

		var name = texts[0];
		expect(name.props.children).toEqual('Tom');
	});

});