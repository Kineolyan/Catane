import 'client/js/components/libs/test';

import tests from 'client/js/components/libs/test';

import React from 'react/addons'; // eslint-disable-line no-unused-vars
import { Text } from 'react-art';

import { PlayersBinding } from 'client/js/components/common/players';
import OtherPlayerInfo from 'client/js/components/parts/GameInterface/PlayersInfo/OtherPlayerInfo.react';

class TestRoot extends tests.Wrapper {
	render() {
		return (<OtherPlayerInfo index={0} binding={this.binding} />);
	}
}

describe('<OtherPlayerInfo>', function() {
  beforeEach(function() {
	  var player = PlayersBinding.createPlayer(1, 'Tom', 'green', 3);
    this.ctx = tests.getCtx(player);
	  this.otherInfo = tests.bootstrap(this.ctx, TestRoot);
  });

	it('has correct elements', function() {
		var texts = tests.getRenderedElements(this.otherInfo, Text);
		expect(texts).toHaveLength(2);

	});

  it('displays the player name', function() {
	  var name = tests.getRenderedElements(this.otherInfo, Text)[0];
	  expect(name.props.children).toEqual('Tom');
  });

	it('displays the number of cards', function() {
		var cardsNb = tests.getRenderedElements(this.otherInfo, Text)[1];
		expect(cardsNb.props.children).toEqual('Cards: 3');
	});

});