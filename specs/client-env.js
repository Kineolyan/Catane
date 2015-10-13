var jsdom = require('jsdom-no-contextify');

jasmine.getEnv().defaultTimeoutInterval = 1000;
if (typeof global.window === 'undefined') {
	global.window = jsdom.jsdom('<html><body></body></html>').defaultView;
	global.document = global.window.document;
	global.navigator = global.window.navigator;
	global.location = { protocol: 'http:', host: 'localhost:3000', port: 3000 };
}

if (global.window.localStorage === undefined) {
	global.window.localStorage = {
		removeItem: function (key) {
			delete this[ key ];
		}
	};
}

// better requestAnimationFrame polyfill than morearty (not overkilling the node process)
if (global.window.requestAnimationFrame === undefined) {
	var lastTime = 0;

	global.window.requestAnimationFrame = function (callback) {
		var currTime = Date.now();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = setTimeout(() => {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};

	if (!global.window.cancelAnimationFrame) {
		global.window.cancelAnimationFrame = (id) => {
			clearTimeout(id);
		};
	}
}
