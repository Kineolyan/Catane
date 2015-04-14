import '../../libs/test';

import React from 'react/addons';
import Player from './Player.react';

var utils = React.addons.TestUtils;

describe('A player', function() {

  beforeEach(function() {
    this.change = function() {};
    spyOn(this, 'change');

    this.player = utils.renderIntoDocument(<Player id={2} initialName='tom' canChangeName={true} onChange={this.change}/>);
  });

  it('should have a name', function() {
      expect(this.player.getName()).toEqual('tom');
  });

  it('should  have an id', function() {
      expect(this.player.getId()).toEqual(2);
  });
});