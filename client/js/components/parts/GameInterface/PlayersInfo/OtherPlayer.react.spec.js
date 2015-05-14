import '../../../libs/test';

import React from 'react/addons';
var utils = React.addons.TestUtils;

import OtherPlayer from './OtherPlayer.react';

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
    expect(this.other.refs.name).toContainText("Tom");
  });

});