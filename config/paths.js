const path = require('path');

function pathItem(name) {
	return function(children) {
		var items = [name];
		if (this instanceof Function) {
			items.unshift(this());
		}
		if (children) {
			items.push(children);
		}
		return path.join.apply(path, items);
	};
}

var PATHS = pathItem('.');
PATHS.nodeModules = pathItem('node_modules');

PATHS.bin = pathItem('bin');

PATHS.server = pathItem('server');
PATHS.libs = pathItem('libs');

PATHS.client = pathItem('client');
PATHS.client.scssLib = pathItem('scss_lib');
PATHS.client.scss = pathItem('scss');
PATHS.client.js = pathItem('js');
PATHS.client.res = pathItem('res');

PATHS.build = pathItem('build');
PATHS.build.libs = pathItem('libs');
PATHS.build.server = pathItem('server');
PATHS.build.client = pathItem('client');
PATHS.build.client.js = pathItem('js');

PATHS.specs = pathItem('specs');
PATHS.specs.matchers = pathItem('matchers');

PATHS.docs = pathItem('docs');
PATHS.docs.libs = pathItem('libs');

PATHS.bower = pathItem('bower');

PATHS._nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .map(p => path.resolve(p));

module.exports = PATHS;