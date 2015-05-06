import tests from '../../../libs/test';
import Globals from '../../../libs/globals';

import React from 'react/addons';
import Card from './Card.react';
import {Text} from 'react-art';

var utils = React.addons.TestUtils;

describe('A card', function() {

  beforeEach(function() {
    this.card = utils.renderIntoDocument(<Card type={Globals.map.resourceName.tuile} />);
  });

  it('should have the type written', function() {
    var texts = tests.getRenderedElements(this.card, Text); 
    expect(texts.length).toEqual(1);
    expect(texts[0].props.children).toEqual('tuile');
  });

});