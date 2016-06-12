'use strict';

(function() {
const nodeUtils = require('util');

function asMap(array) {
	var map = {};
	array.forEach(function(value) { map[value] = (map[value] || 0) + 1; })
}

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
				result.message = 'Expecting ' + nodeUtils.inspect(actual)
					+ (result.pass === true ? ' not' : '')
					+ ' to have length of ' + length;
				if (!result.pass) {
					result.message += '. Actual is ' + actualLength;
				}

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
				if (!result.pass) {
					result.message += '. Actual is ' + actual.size;
				}

				return result;
			}
		}
	},
	toBeEmpty: function() {
		return {
			compare: function(actual) {
				var empty;
				if (actual.isEmpty !== undefined) { empty = actual.isEmpty(); }
				else if (actual.size !== undefined) { empty = actual.size === 0; }
				else if (actual.length !== undefined) { empty = actual.length === 0; }
				else { throw new Error('No function to get size of ' + nodeUtils.inspect(actual)); }

				var result = { pass: empty };
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
				var result = { pass: false };
				if (actual.length === expected.length) {
					result.pass = util.equals(asMap(actual), asMap(expected), equalityTesters);
				}

				result.message = 'Expecting ' + nodeUtils.inspect(actual)
					+ (result.pass === true ? ' not' : '')
					+ ' to have members of ' + nodeUtils.inspect(expected);

				return result;
			}
		}
	}
};

beforeEach(function() {
	jasmine.addMatchers(arrayMatchers);
});

})(jasmine);