'use strict';

(function() {

var n_util = require('util');

var mapMatchers = {
	toHaveKey: function(util, equalityTesters) {
		return {
			compare: function(actual, expectedKey) {
				var result = { pass: (expectedKey in actual) };
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
				var result = { pass: util.equals(Object.keys(actual), expectedKeys, equalityTesters) };
				result.message = 'Expecting ' + n_util.inspect(actual)
					+ (result.pass === true ? ' not' : '')
					+ ' to have all keys ' + n_util.inspect(expectedKeys);

				return result;
			}
		}
	},
	toContainKeys: function(util, equalityTesters) {
		return {
			compare: function(actual, expectedKeys) {
				var keys = Object.keys(actual);
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