'use strict';

(function() {
var n_util = require('util');

var arrayMatchers = {
	toBeIn: function(util, equalityTesters) {
		return {
			compare: function(actual, expected) {
				expected = expected || [];

				var result = { pass: util.contains(expected, actual, equalityTesters) };
				result.message = result.pass === true ?
					'Expecting ' + actual + ' not to be in ' + expected :
					'Expecting ' + actual + ' to be in ' + expected;

				return result;
			}
		}
	},
	toHaveLength: function() {
		return {
			compare: function(actual, length) {
				var actualLength = actual.length;
				var result = { pass: actualLength === length };
				result.message = 'Expecting item'
					+ (result.pass === true ? ' not' : '')
					+ ' to have length of ' + length
					+ '. Actual is ' + actualLength;

				return result;
			}
		}
	},
	toHaveSize: function() {
		return {
			compare: function(actual, size) {
				var result = { pass: actual.size === size };
				result.message = 'Expecting ' + actual
					+ (result.pass === true ? ' not' : '')
					+ ' to have size of ' + size;

				return result;
			}
		}
	},
	toBeEmpty: function() {
		return {
			compare: function(actual) {
				var result = { pass: actual.length === 0 };
				result.message = 'Expecting ' + actual
					+ (result.pass === true ? ' not' : '')
					+ ' to be empty';

				return result;
			}
		}
	},
	toHaveMembers: function(util, equalityTesters) {
		return {
			compare: function(actual, expected) {
				var result = {
					pass: actual.length === expected.length
						&& actual.every(function(value) { return util.contains(expected, value, equalityTesters); })
						&& expected.every(function(value) { return util.contains(actual, value, equalityTesters); })
				};

				result.message = 'Expecting ' + n_util.inspect(actual)
					+ (result.pass === true ? ' not' : '')
					+ ' to have members of ' + n_util.inspect(expected);

				return result;
			}
		}
	}
};

beforeEach(function() {
	jasmine.addMatchers(arrayMatchers);
});

})(jasmine);