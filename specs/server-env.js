// Requiring this polyfill to have a fully ES6 environment (Map, Symbol, ...)
require('babel/register');

// Create environment
var logging = require('libs/log/logger');
// TODO move log creation to the module
global.logger = logging.createLogger(logging.Level.SILENT);
global.TIME_TO_RECONNECT = 250; // 500 ms
