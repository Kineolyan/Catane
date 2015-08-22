import tests from 'client/js/components/libs/test';
import { Board } from 'client/js/components/libs/globals';
import { Channel } from 'client/js/components/libs/socket';

import React from 'react/addons';
import { Group, Text } from 'react-art';

import Card from 'client/js/components/parts/GameInterface/PlayersInfo/Card.react';

var utils = React.addons.TestUtils;

describe('<Card>', function() {
	beforeEach(function() {
		this.card = utils.renderIntoDocument(<Card type={Board.resourceName.tuile} index={2}/>);
		this.root = function() { return tests.getRenderedElements(this.card, Group)[0]; };
	});

	it('should have the type written', function() {
		var texts = tests.getRenderedElements(this.card, Text);
		expect(texts).toHaveLength(1);
		expect(texts[0].props.children).toEqual('tuile');
	});

	it('has a click action', function() {
		expect(this.root().props).toHaveKey('onClick');
	});

	describe('on click', function() {
		beforeEach(function() {
			var ctx = tests.getCtx();
			this.socket = tests.createServer(ctx);

			tests.simulateClick(this.root());
		});

		it('drops the card', function() {
			var message = this.socket.lastMessage(Channel.playResourcesDrop);

			var drop = {};
			drop[Board.resourceName.tuile] = 1;
			expect(message).toEqual(drop);
		});
	});

});