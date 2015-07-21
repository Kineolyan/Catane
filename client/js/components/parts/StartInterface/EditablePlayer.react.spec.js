import tests from 'client/js/components/libs/test';

import React from 'react/addons';

import EditablePlayer from 'client/js/components/parts/StartInterface/EditablePlayer.react';

describe('A player', function() {

  beforeEach(function() {
    this._ctx = tests.getCtx();
  });

  it('should have a name', function(done) {
    setTimeout(() => {
      var Bootstrap = this._ctx.bootstrap(EditablePlayer);
      expect(React.renderToStaticMarkup(<Bootstrap />)).toMatch(/Bob/);
      done();
    }, 100);
  });

});