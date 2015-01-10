
require('../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;
var Player = require('./PlayerReact');



describe('A player', () => {

  beforeEach(() => {
    this.change = () => {};
    spyOn(this, 'change');

    this.player = utils.renderIntoDocument(<Player id={2} initialName='tom' canChangeName={true} onChange={this.change}/>);
  });

  it('to have a name', () => {
      expect(this.player.getName()).toEqual('tom');
  });

  it('to have an id', () => {
      expect(this.player.getId()).toEqual(2);
  });

  it('can change name and change step', (done) => {
    spyOn(window, 'prompt').and.returnValue("jean");

    utils.Simulate.click(this.player.refs.modify.getDOMNode());
    setTimeout(() => {
      expect(this.player.getName()).toEqual('jean');
      expect(this.change).toHaveBeenCalled();
      done();
    }, 300);
  });

});