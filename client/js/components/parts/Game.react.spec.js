import tests from 'client/js/components/libs/test';
import { Step } from 'client/js/components/libs/globals';
import { BoardBinding } from 'client/js/components/common/map';

import React from 'react/addons';

import Game from 'client/js/components/parts/Game.react';
import StartInterface from 'client/js/components/parts/StartInterface/StartInterface.react';
import GameInterface from 'client/js/components/parts/GameInterface/GameInterface.react';
import DevTool from 'client/js/components/parts/DevTool.react';

var utils = React.addons.TestUtils;

describe('<Game>', function() {

  beforeEach(function() {
    this.ctx = tests.getCtx();
    this.game = tests.bootstrap(this.ctx, Game);
  });

  it('creates a <StartInterface> at start', function() {
      expect(utils.scryRenderedComponentsWithType(this.game, StartInterface)).toHaveLength(1);
  });

  describe('when started', function() {
    beforeEach(function() {
      var boardBinding = BoardBinding.from(this.ctx.getBinding());
      boardBinding.buildBoard({
        tiles: [
          { x: 0, y: 0, resource: 'tuile', diceValue: 1 }
        ], cities: [
          { x: 0, y: 1 }
        ], paths: [
          { from: { x: 1, y: 0 }, to: { x: 0, y: 1 } }
        ]
      });

      this.ctx.getBinding().atomically()
        .set('game.board', boardBinding.binding)
        .set('step', Step.prepare)
        .commit();
    });

    it('removes <StartInterface>', function(done) {
        setTimeout(() => {
          expect(utils.scryRenderedComponentsWithType(this.game, StartInterface)).toBeEmpty();
          done();
        }, 200);
    });

    it('creates a <GameInterface>', function(done) {
        setTimeout(() => {
          expect(utils.scryRenderedComponentsWithType(this.game, GameInterface)).toHaveLength(1);
          done();
        }, 200);
    });
  });

  it('should not have the dev toolbar', function() {
    expect(utils.scryRenderedComponentsWithType(this.game, DevTool)).toBeEmpty();
  });

});