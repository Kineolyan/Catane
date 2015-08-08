import tests from 'client/js/components/libs/test';

import React from 'react/addons';
import Immutable from 'immutable';

import Lobby from 'client/js/components/parts/StartInterface/Lobby.react';
import { Channel } from 'client/js/components/libs/socket';

var utils = React.addons.TestUtils;

describe('<Lobby>', function() {
	beforeEach(function() {
		this.ctx = tests.getCtx();

		// Initializes some games
		var binding = this.ctx.getBinding();
		binding.set('start.games', Immutable.fromJS([{ id: 3 }, { id: 1 }, { id: 2 }]));

		this.socket = tests.createServer(this.ctx);
		this.lobby = tests.bootstrap(this.ctx, Lobby);
	});

	it('requests the list of games', function() {
		expect(this.socket.messages(Channel.gameList)).toHaveLength(1);
	});

	it('should render the list of games', function() {
		var elems = utils.scryRenderedDOMComponentsWithClass(this.lobby, 'game-elem');
		expect(elems).toHaveLength(3);
	});

	it('assigns the game id to each entry', function() {
		var ids = utils.scryRenderedDOMComponentsWithClass(this.lobby, 'game-elem')
				.map(elem => elem.props['data-id']);
		expect(ids).toEqual([3, 1, 2]);
	});

});