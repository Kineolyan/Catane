var jsdom = require('jsdom');

if(typeof global.window === 'undefined') {
  global.window = jsdom.jsdom('<html><body></body></html>').defaultView;// jshint ignore:line
  global.document = global.window.document;// jshint ignore:line
  global.navigator = global.window.navigator;// jshint ignore:line
  jasmine.getEnv().defaultTimeoutInterval = 1000;
}

var tests = module.exports = {
  jsdom: jsdom,
  getRenderedElements(inst, type) { //get react sub elements as an array
    if (!inst) {
      return [];
    }

    var ret = inst._currentElement.type === type.type ? [inst] : [];

    if(inst._renderedComponent) {
        ret = ret.concat(tests.getRenderedElements(inst._renderedComponent, type));
    } else if(inst._renderedChildren) {
        for(var i in inst._renderedChildren) {
          if(inst._renderedChildren.hasOwnProperty(i)) {
            ret = ret.concat(tests.getRenderedElements(inst._renderedChildren[i], type));
          }
        }
    }

    return ret;
  }
};

