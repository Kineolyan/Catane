import tests from 'client/js/components/libs/test';

import React from 'react/addons';

import StartInterface from 'client/js/components/parts/StartInterface/StartInterface.react';
import Room from 'client/js/components/parts/StartInterface/Room.react';
import Lobby from 'client/js/components/parts/StartInterface/Lobby.react';
import EditablePlayer from 'client/js/components/parts/StartInterface/EditablePlayer.react';

var utils = React.addons.TestUtils;

describe('<StartInterface>', function() {
	beforeEach(function() {
		this.ctx = tests.getCtx();
		this.socket = tests.createServer(this.ctx);

		this.start = tests.bootstrap(this.ctx, StartInterface);
	});

	it('should render the player', function() {
		expect(utils.scryRenderedComponentsWithType(this.start, EditablePlayer)).toHaveLength(1);
	});

	it('should render the lobby when no game are chosen', function() {
		expect(utils.scryRenderedComponentsWithType(this.start, Lobby)).toHaveLength(1);
	});

	it('should render the room when a game is chosen', function(done) {
		this.ctx.getBinding().set('start.gameChosen.id', 1);
		setTimeout(() => {
			expect(utils.scryRenderedComponentsWithType(this.start, Room)).toHaveLength(1);
			done();
		}, 200);

	});

});