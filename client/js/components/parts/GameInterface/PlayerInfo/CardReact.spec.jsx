var tests = require('../../../libs/test');
var Globals = require('../../../libs/globals');

var React = require('react/addons');
var utils = React.addons.TestUtils;

var Card = require('./CardReact');
var Text = require('react-art').Text;

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