import tests from 'client/js/components/libs/test';
import Globals from 'client/js/components/libs/globals';

import React from 'react/addons';
import {Text} from 'react-art';

import Card from 'client/js/components/parts/GameInterface/PlayersInfo/Card.react';

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