import tests from 'client/js/components/libs/test';

import React from 'react/addons';
import { Text } from 'react-art';

import CustomText from 'client/js/components/parts/GameInterface/Elements/Text.react';

var utils = React.addons.TestUtils;

describe('<Text>', function() {
  beforeEach(function() {
    var text = utils.renderIntoDocument(<CustomText text={'bob'} color={'blue'} alignment={'left'} />);
    this.text = tests.getRenderedElements(text, Text);
  });

  it('should have a basic art text element', function() {
    expect(this.text).toHaveLength(1);
  });

  it('should have a default font size', function() {
    expect(this.text[0].props.font).toHaveKey('font-size');
  });

  it('should render the text', function() {
    expect(this.text[0].props.children).toEqual('bob');
  });

  it('should render the color', function() {
    expect(this.text[0].props.fill).toEqual('blue');
  });

  it('should align the text', function() {
    expect(this.text[0].props.alignment).toEqual('left');
  });

});