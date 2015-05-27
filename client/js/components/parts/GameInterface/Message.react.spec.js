import '../../libs/test';

import React from 'react/addons';
import MessageV from './MessageV.react';

var utils = React.addons.TestUtils;


describe('The message box', function() {

  beforeEach(function() {
    this.message = utils.renderIntoDocument(<MessageV />);
  });

  it('should display some text', function() {
    expect(this.message.refs.message).toContainText('');
  });

  it('can change the text', function(done) {
    this.message.updateText('Hi');
    var self = this;
    setTimeout(function() {
      expect(self.message.refs.message).toContainText('Hi');
      done();
    }, 100);
  });


});