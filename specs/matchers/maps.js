'use strict';

(function() {

var n_util = require('util');

function isMap(object) {
	return Map === object.constructor;
}

function getKeys(object) {
	return isMap(object) ? Array.from(object.keys()) : Object.keys(object);
}

var mapMatchers = {
	toHaveKey: function(util, equalityTesters) {
		return {
			compare: function(actual, expectedKey) {
				var result = {
					pass: isMap(actual) ? actual.has(expectedKey) : (expectedKey in actual)
				};
				result.message = 'Expecting ' + n_util.inspect(actual)
					+ (result.pass === true ? ' not' : '')
					+ ' to have key ' + n_util.inspect(expectedKey);

				return result;
			}
		}
	},
	toHaveKeys: function(util, equalityTesters) {
		return {
			compare: function(actual, expectedKeys) {
				var keys = getKeys(actual);

				var result = {
					pass: keys.length === expectedKeys.length
						&& keys.every(function(key) { return util.contains(expectedKeys, key, equalityTesters); })
				};
				result.message = 'Expecting actual keys' + n_util.inspect(keys)
					+ (result.pass === true ? ' not' : '')
					+ ' to be ' + n_util.inspect(expectedKeys);

				return result;
			}
		}
	},
	toContainKeys: function(util, equalityTesters) {
		return {
			compare: function(actual, expectedKeys) {
				var keys = getKeys(actual);
				var result = {
					pass: keys.every(function(key) {
						return util.contains(expectedKeys, key, equalityTesters);
					})
				};

				result.message = 'Expecting ' + n_util.inspect(actual)
					+ (result.pass === true ? ' not' : '')
					+ ' to contain keys ' + n_util.inspect(expectedKeys);

				return result;
			}
		}
	}
};

beforeEach(function() {
	jasmine.addMatchers(mapMatchers);
});

})(jasmine);