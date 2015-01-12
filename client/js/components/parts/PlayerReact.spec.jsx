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

  it('should have a name', () => {
      expect(this.player.getName()).toEqual('tom');
  });

  it('should  have an id', () => {
      expect(this.player.getId()).toEqual(2);
  });

  it('can change name if specified and then change step', (done) => {
    spyOn(window, 'prompt').and.returnValue("jean");

    utils.Simulate.click(this.player.refs.modify.getDOMNode());
    setTimeout(() => {
      expect(this.player.getName()).toEqual('jean');
      expect(this.change).toHaveBeenCalled();
      done();
    }, 300);
  });

  afterEach(() => {
    React.unmountComponentAtNode(this.player.getDOMNode().parent);
  });
});