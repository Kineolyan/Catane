var jsdom = require('jsdom');

global.window = jsdom.jsdom('<html><body></body></html>').defaultView;// jshint ignore:line
global.document = global.window.document;// jshint ignore:line
global.navigator = global.window.navigator;// jshint ignore:line

jasmine.getEnv().defaultTimeoutInterval = 1000;


module.exports = jsdom;