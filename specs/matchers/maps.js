'use strict';

(function() {

var mapMatchers = {
	toHaveKey: function() {
		return {
			compare: function(actual, expectedKey) {
				var result = { pass: (expectedKey in actual) };
				result.message = 'Expecting ' + actual
					+ (result.pass === true ? ' not' : '')
					+ ' to have key ' + expectedKey;

				return result;
			}
		}
	},
	toHaveKeys: function(util, equalityTesters) {
		return {
			compare: function(actual, expectedKeys) {
				var result = { pass: util.equals(Object.keys(actual), expectedKeys, equalityTesters) };
				result.message = 'Expecting ' + actual
					+ (result.pass === true ? ' not' : '')
					+ ' to have all keys ' + expectedKeys;

				return result;
			}
		}
	}
};

beforeEach(function() {
	jasmine.addMatchers(mapMatchers);
});

})(jasmine);