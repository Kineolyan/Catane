import tests from 'client/js/components/libs/test';

import React from 'react/addons';
import {Text} from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';

import Dice from 'client/js/components/parts/GameInterface/Dice.react';

var utils = React.addons.TestUtils;

//TODO: investigate setTimeout hanging in node when called multiples times
describe('A dice', function() {

  beforeAll(function() {
    var self = this;
    this._ctx = tests.getCtx({dice: {
            enabled: false,
            rolling: false, 
            values: [1,1]
    }});

    var proxy = React.createClass({

      render() {
        return (<Dice startTime={10} binding={self._ctx.getBinding().sub('dice')} />);
      }

    });

    var DiceB = this._ctx.bootstrap(proxy);

    this.dice = utils.renderIntoDocument(<DiceB />);

  });


  it('should have two parts', function() {
    expect(tests.getRenderedElements(this.dice, Rectangle).length).toEqual(2);
  });

  it('should render the correct value at start', function() {
    var text1 = tests.getRenderedElements(this.dice, Text)[0]._store.props.children;
    var text2 = tests.getRenderedElements(this.dice, Text)[1]._store.props.children;

    expect(text1).toEqual("1");
    expect(text2).toEqual("1");
  });


});