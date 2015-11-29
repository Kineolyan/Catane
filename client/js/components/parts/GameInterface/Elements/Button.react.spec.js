import tests from 'client/js/components/libs/test';

import React from 'react/addons';

import { Group } from 'react-art';
import Text from 'client/js/components/parts/GameInterface/Elements/Text.react';
import Button from 'client/js/components/parts/GameInterface/Elements/Button.react';
import Rectangle from 'react-art/shapes/rectangle';

var utils = React.addons.TestUtils;

// need to figure out node-canvas
xdescribe('<Button>', function() {
  beforeEach(function() {
    this.button = utils.renderIntoDocument(<Button label={'bob'} minWidth={200} margin={10} />);
  });

  it('should have a label', function() {
    const texts = tests.getRenderedElements(this.button, Text);
    expect(texts).toHaveLength(1);
    expect(texts[0].props.text).toEqual('bob');
  });

  it('should have a background', function() {
    const rectangles = tests.getRenderedElements(this.button, Rectangle);
    expect(rectangles).toHaveLength(1);
    expect(rectangles[0].props.fill).toBeDefined();
  });

  describe('the width', function() {

    beforeEach(function() {
    });

    it('should be the min width and the margin', function() {
      const group = tests.getRenderedElements(this.button, Group)[0];
      expect(group[0].props.width).toEqual(200 + 10 * 2);
    });

    it('should be a least more than the width of the text', function() {
      const button = utils.renderIntoDocument(<Button label={'boby est un chien qui aime bien allez manger'} minWidth={200} margin={10}/>);
      const group = tests.getRenderedElements(button, Group)[0];
      expect(group[0].props.width).toBeGreaterThan(200 + 10 * 2);

    });
  });

});