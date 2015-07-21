import tests from 'client/js/components/libs/test';

import React from 'react/addons';

import StartInterface from 'client/js/components/parts/StartInterface/StartInterface.react';
import Room from 'client/js/components/parts/StartInterface/Room.react';
import Lobby from 'client/js/components/parts/StartInterface/Lobby.react';
import EditablePlayer from 'client/js/components/parts/StartInterface/EditablePlayer.react';

var utils = React.addons.TestUtils;

describe('The start interface', function() {

	beforeEach(function() {
		this._ctx = tests.getCtx();
		this.start = tests.bootstrap(this._ctx, StartInterface);
	});

	it('should render the player', function() {
		expect(utils.scryRenderedComponentsWithType(this.start, EditablePlayer).length).toEqual(1);
	});

	it('should render the lobby when no game are chosen', function() {
		expect(utils.scryRenderedComponentsWithType(this.start, Lobby).length).toEqual(1);
	});

	it('should render the room when a game is chosen', function(done) {
		this._ctx.getBinding().set('start.gameChosen.id', 1);
		setTimeout(() => {
			expect(utils.scryRenderedComponentsWithType(this.start, Room).length).toEqual(1);
			done();
		}, 200);

	});

});