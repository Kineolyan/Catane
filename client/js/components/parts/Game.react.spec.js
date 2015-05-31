import tests from '../libs/test';
import Globals from '../libs/globals';

import React from 'react/addons';
import Game from './Game.react';
import StartInterface from './StartInterface/StartInterface.react';

var utils = React.addons.TestUtils;

describe('A game', function() {

  beforeEach(function() {

    this._ctx = tests.getCtx();
    var GameB = this._ctx.bootstrap(Game);
    this.game= utils.renderIntoDocument(<GameB />);

  });

  it('should start with the start interface', function() {
      expect(utils.scryRenderedComponentsWithType(this.game, StartInterface).length).toBe(1);
  });

  it('should remove the start interface when it started', function(done) {
      this._ctx.getBinding().set('step', Globals.step.prepare);
      setTimeout(() => {
        expect(utils.scryRenderedComponentsWithType(this.game, StartInterface).length).toBe(0);
        done();
      }, 200);
  });

});