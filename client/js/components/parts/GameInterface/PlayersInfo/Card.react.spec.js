import tests from 'client/js/components/libs/test';
import { Board } from 'client/js/components/libs/globals';
import { gameManager } from 'client/js/components/listener/listener';

import React from 'react/addons';
import { Group, Text } from 'react-art';

import Card from 'client/js/components/parts/GameInterface/PlayersInfo/Card.react';

var utils = React.addons.TestUtils

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

			this.mgr = gameManager();
			spyOn(this.mgr, 'selectCard');
			tests.simulateClick(this.root());
		});

		it('drops the card', function() {
			expect(this.mgr.selectCard).toHaveBeenCalledWith('tuile', 2);
		});
	});

});
