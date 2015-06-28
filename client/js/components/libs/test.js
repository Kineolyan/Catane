import jsdom from 'jsdom';
import Morearty from 'morearty';

import Globals from 'client/js/components/libs/globals';
import Players from 'client/js/components/common/players';

var tests = {
  jsdom: jsdom,
  ctx: null,
  getRenderedElements(inst, type) { //get react sub elements as an array for non-DOM elements - ie react art elements

    if (!inst) {
      return [];
    }

    var internal = inst._reactInternalInstance;
    if(!internal) {
      internal = inst;
    }

    var ret = (internal._currentElement.type.displayName && internal._currentElement.type.displayName === type.displayName) ? [internal._currentElement] : [];
    if(internal._renderedComponent) {
        ret = ret.concat(tests.getRenderedElements(internal._renderedComponent, type));
    } else if(internal._renderedChildren) {
        for(var i in internal._renderedChildren) {
          if(internal._renderedChildren.hasOwnProperty(i)) {
            ret = ret.concat(tests.getRenderedElements(internal._renderedChildren[i], type));
          }
        }
    }

    return ret;
  },
  getCtx(init = '') {

    Players.deleteAll();
    Players.myId = 1;
    Players.createPlayer(Players.myId, 'Bob');

    var initState = {
              start: {
                games: [],
                gameChosen: {},
              },

              game: {
                board: [],
                dice: {
                  enabled: false,
                  rolling: false,
                  values: [1,1]
                },
                message: 'Hello'
              },

              players: Players,
              step: Globals.step.init,
              server: {id: 1, sid: 2}
    };

    if(init) {
      initState = init;
    }

    this.ctx = Morearty.createContext({
            initialState: initState
    });

    return this.ctx;
  }
};

export default tests;