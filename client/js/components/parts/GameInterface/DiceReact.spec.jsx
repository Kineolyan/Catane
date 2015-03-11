var tests = require('../../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;
var Dice = require('./DiceReact');
var Text = require('react-art').Text;
var Rectangle = require('react-art/shapes/rectangle');

describe('A dice', () => {

  beforeEach(() => {
    this.dice = utils.renderIntoDocument(<Dice startTime={10} />);
  });

  it('should be able to roll and stop', (done) => {
    this.dice.result({first: 2, second: 3}, () => {
      expect(this.dice.state.rolling).toBeFalsy();
      done();
    });
    
    expect(this.dice.state.rolling).toBeTruthy();
  });

  it('should have two parts', () => {
    expect(tests.getRenderedElements(this.dice, Rectangle).length).toEqual(2);
  });

  it('should render the correct value at start', () => {
    var text1 = tests.getRenderedElements(this.dice, Text)[0].props.children;
    var text2 = tests.getRenderedElements(this.dice, Text)[1].props.children;

    expect(text1).toEqual("1");
    expect(text2).toEqual("1");
  });

  it('should render the correct result after throwing', (done) => {
    this.dice.result({first: 2, second: 3}, () => {
      var text1 = tests.getRenderedElements(this.dice, Text)[0].props.children;
      var text2 = tests.getRenderedElements(this.dice, Text)[1].props.children;
      expect(text1).toEqual("2");
      expect(text2).toEqual("3");
      done();
    });
  });

});