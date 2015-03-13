require('../../libs/test');

var React = require('react/addons');
var utils = React.addons.TestUtils;
var Player = require('./PlayerReact');

describe('A player', function() {

  beforeEach(function() {
    this.change = function() {};
    spyOn(this, 'change');

    this.player = utils.renderIntoDocument(<Player id={2} initialName='tom' canChangeName={true} onChange={this.change}/>);
  });

  it('should have a name', function() {
      expect(this.player.getName()).toEqual('tom');
  });

  it('should  have an id', function() {
      expect(this.player.getId()).toEqual(2);
  });

  it('can change name if specified and then change step', function(done) {
    spyOn(window, 'prompt').and.returnValue("jean");

    utils.Simulate.click(this.player.refs.modify);
    setTimeout(() => {
      expect(this.player.getName()).toEqual('jean');
      expect(this.change).toHaveBeenCalled();
      done();
    }, 500);
  });

  afterEach(function() {
    React.unmountComponentAtNode(this.player.getDOMNode().parent);
  });
});