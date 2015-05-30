import tests from '../libs/test';
import Globals from '../libs/globals';

import React from 'react/addons';
import Game from './Game.react';
import StartInterface from './StartInterface/StartInterface.react';

var utils = React.addons.TestUtils;

describe('A game', function() {

  beforeEach(function() {
    var binding = tests.getCtx().getBinding();
    this.game = tests.mockRender(() => <Game binding={binding} />);

  });

  it('should start with the start interface', function() {
      expect(utils.scryRenderedComponentsWithType(this.game, StartInterface).length).toBe(1);
  });

  it('should remove the start interface when it started', function() {
      tests.ctx.getBinding().set('step', Globals.step.prepare)
      expect(utils.scryRenderedComponentsWithType(this.game, StartInterface).length).toBe(0);
  });

});