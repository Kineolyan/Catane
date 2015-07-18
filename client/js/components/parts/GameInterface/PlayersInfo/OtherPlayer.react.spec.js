import 'client/js/components/libs/test';

import React from 'react/addons';

import OtherPlayer from 'client/js/components/parts/GameInterface/PlayersInfo/OtherPlayer.react';

var utils = React.addons.TestUtils;

describe('A card representing an other player', function() {

  beforeEach(function() {
    this.other = utils.renderIntoDocument(<OtherPlayer nbOfCards={3} name={'Tom'}/>);
  });

  it('should have the number of cards', function() {
    expect(this.other.refs.cards).toBeDefined();
    expect(this.other.refs.cards).toContainText('3');
  });

  it('should have the name', function() {
    expect(this.other.refs.name).toBeDefined();
    expect(this.other.refs.name).toContainText('Tom');
  });

});