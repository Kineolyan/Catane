import tests from '../../libs/test';

import React from 'react/addons';
import Dice from './Dice.react';
import {Text} from 'react-art';
import Rectangle from 'react-art/shapes/rectangle';

var utils = React.addons.TestUtils;


describe('A dice', function() {

  beforeEach(function() {
    this.dice = utils.renderIntoDocument(<Dice startTime={10} />);
  });

  it('should be able to roll and stop', function(done) {
    this.dice.result({first: 2, second: 3}, () => {
      expect(this.dice.state.rolling).toBeFalsy();
      done();
    });

    expect(this.dice.state.rolling).toBeTruthy();
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

  it('should render the correct result after throwing', function(done) {
    this.dice.result({first: 2, second: 3}, () => {
      var text1 = tests.getRenderedElements(this.dice, Text)[0]._store.props.children;
      var text2 = tests.getRenderedElements(this.dice, Text)[1]._store.props.children;
      expect(text1).toEqual("2");
      expect(text2).toEqual("3");
      done();
    });
  });

});