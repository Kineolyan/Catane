// Requiring this polyfill to have a fully ES6 environment (Map, Symbol, ...)
require('babel/register');

// Create environment
var logging = require("../build/server/util/log/logger");
global.logger = logging.createLogger(logging.Level.SILENT);