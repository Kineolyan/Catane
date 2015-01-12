require('../libs/test');


var React = require('react/addons');
var utils = React.addons.TestUtils;
var Game = require('./GameReact');
var Globals = require('../libs/globals');
var Room = require('./RoomReact');
var Lobby = require('./LobbyReact');

describe('A game', () => {

  beforeEach(() => {
    var data = {id: 'id', name: 'player'};
    this.game = utils.renderIntoDocument(<Game init={data}/>);
  });

  it('should start at the init step', () => {
    expect(this.game.state.step).toEqual(Globals.step.init);
  });

  it('should have the list of room when in chooseLobby', () => {
    this.game.setMinimalStep(Globals.step.chooseLobby);
    expect(utils.scryRenderedComponentsWithType(this.game, Lobby).length).toEqual(1);
  });

  it('should be able to set a minimal step', () => {
    this.game.setMinimalStep(Globals.step.started);
    expect(this.game.state.step).toEqual(Globals.step.started);

    this.game.setMinimalStep(Globals.step.inLobby);
    expect(this.game.state.step).toEqual(Globals.step.started); 
  });

  it('should choose a game and go in room', () => {
    this.game.chooseGame(2);

    expect(this.game.state.step).toEqual(Globals.step.inLobby);
    expect(this.game.state.game).toEqual(2);
    expect(utils.scryRenderedComponentsWithType(this.game, Room).length).toEqual(1);

  });

  afterEach(() => {
    React.unmountComponentAtNode(this.game.getDOMNode().parent);
  });


});