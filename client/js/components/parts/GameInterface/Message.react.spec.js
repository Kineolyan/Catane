import tests from '../../libs/test';

import React from 'react/addons';
import Message from './Message.react';
import {Text} from 'react-art';

var utils = React.addons.TestUtils;


describe('The message box', function() {

  beforeAll(function() {
    var self = this;
    this._ctx = tests.getCtx({message: 'Start'});

    var proxy = React.createClass({

      render() {
        return (<Message binding={self._ctx.getBinding().sub('message')} />);
      }

    });

    var MessageB = this._ctx.bootstrap(proxy);

    this.message = utils.renderIntoDocument(<MessageB />);

  });

  it('should display some text', function() {
    expect(tests.getRenderedElements(this.message, Text)[0]._store.props.children).toBe('Start');
  });

});