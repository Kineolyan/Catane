require('../../libs/test');


var React = require('react/addons');
var utils = React.addons.TestUtils;
var StartInterface = require('./StartInterfaceReact');
var Globals = require('../../libs/globals');
var Room = require('./RoomReact');
var Lobby = require('./LobbyReact');

describe('The start interface', () => {

  beforeEach(() => {
    var data = {id: 'id', name: 'player'};

    this.start = () => {};
    spyOn(this, 'start');

    this.game = utils.renderIntoDocument(<StartInterface init={data} onStart={this.start}/>);
  });

  it('should start at the init step', () => {
    expect(this.game.state.step).toEqual(Globals.step.init);
  });

  it('should have the list of room when in chooseLobby', () => {
    this.game.setMinimalStep(Globals.step.chooseLobby);
    expect(utils.scryRenderedComponentsWithType(this.game, Lobby).length).toEqual(1);
  });

  it('should be able to set a minimal step', (done) => {
    this.game.setMinimalStep(Globals.step.started);

    setTimeout(() => {
      expect(this.game.state.step).toEqual(Globals.step.started);
      setTimeout(() => {
        this.game.setMinimalStep(Globals.step.inLobby);
        expect(this.game.state.step).toEqual(Globals.step.started);
        done();
      }, 500);
    }, 500);

    
  });

  it('should choose a game and go in room and then leave it', () => {
    this.game.chooseGame(2);

    expect(this.game.state.step).toEqual(Globals.step.inLobby);
    expect(this.game.state.game).toEqual(2);
    
    expect(utils.scryRenderedComponentsWithType(this.game, Room).length).toEqual(1);


    this.game.leaveRoom();
    expect(this.game.state.game).toEqual({});
  });

  it('should be able to start the game', () => {
    this.game.startGame();
    expect(this.start).toHaveBeenCalled();
  });


  afterEach(() => {
    React.unmountComponentAtNode(this.game.getDOMNode().parent);
  });


});