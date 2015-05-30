import jsdom from 'jsdom';
import Morearty from 'morearty';
import Globals from './globals';
import Players from '../common/players';
import React from 'react/addons';

var TestUtils = React.addons.TestUtils;


jasmine.getEnv().defaultTimeoutInterval = 1000;
if(typeof global.window === 'undefined') {
      global.window = jsdom.jsdom('<html><body></body></html>').defaultView;// jshint ignore:line
      global.document = global.window.document;// jshint ignore:line
      global.navigator = global.window.navigator;// jshint ignore:line
      global.location = { protocol: 'http:', host: 'localhost:3000', port: 3000};
}

var tests = {
  jsdom: jsdom,
  ctx: null,
  getRenderedElements(inst, type) { //get react sub elements as an array

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
  getCtx() {

    Players.deleteAll();
    Players.myId = parseInt(1, 10);
    Players.createPlayer(Players.myId, 'Bob');

    this.ctx = Morearty.createContext({
            initialState: {
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
              step: Globals.step.init
        }
      });

    return this.ctx;
  },
  mockRender(instanceFn) {
      var self = this;
      var boot = React.createClass({
            childContextTypes: {
              morearty: React.PropTypes.any
            },
            getChildContext() {
              return {morearty: self.ctx};
            },
            render() {
              return instanceFn();
            },
      });

      return TestUtils.renderIntoDocument(React.createElement(boot));
  }
};


export default tests;