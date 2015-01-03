'use strict';

(function() {

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
			compare: function(actual, size) {
				var result = { pass: actual.length === size };
				result.message = 'Expecting ' + actual
					+ (result.pass === true ? ' not' : '')
					+ ' to have length of ' + size;

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
	}
};

beforeEach(function() {
	jasmine.addMatchers(arrayMatchers);
});

})(jasmine);