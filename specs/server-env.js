// Requiring this polyfill to have a fully ES6 environment (Map, Symbol, ...)
require('babel-register');

// Create environment
var logging = require('libs/log/logger');
logging.logger.configure(logging.Level.SILENT);

const Server = require('server/server');
Server.TIME_TO_RECONNECT = 250; // 500 ms
