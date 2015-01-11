// Requiring this polyfill to have a fully ES6 environment (Map, Symbol, ...)
require("gulp-6to5/node_modules/6to5/register");

// Create environment
var logging = require("../build/server/util/log/logger");
global.logger = logging.createLogger(logging.Level.SILENT);