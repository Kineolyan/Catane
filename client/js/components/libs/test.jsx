var jsdom = require('jsdom');

window = jsdom.jsdom('<html><body></body></html>').defaultView;// jshint ignore:line
document = window.document;// jshint ignore:line
navigator = window.navigator;// jshint ignore:line

jasmine.getEnv().defaultTimeoutInterval = 1000;


module.exports = jsdom;