'use strict';

(function() {
var n_util = require('util');

function isInteger(value) {
	if (value !== undefined && value !== null) {
		return (typeof value === 'number') ?
			value == parseInt(value) :
			value === parseInt(value.toString());
	} else {
		return false;
	}
}

function isFloat(value) {
	if (value !== undefined && value !== null) {
		return (typeof value === 'number') ?
			value == parseFloat(value) :
			value === parseFloat(value.toString());
	} else {
		return false;
	}
}

var typeMatchers = {
	toBeAnInteger: function() {
		return {
			compare: function(actual) {
				var result = { pass: isInteger(actual) };

				result.message = 'Expecting ' + actual
					+ (result.pass ? ' not' : '')
					+ ' to be an integer';

				return result;
			}
		}
	},
	toBeAFloat: function() {
		return {
			compare: function(actual) {
				var result = { pass: isFloat(actual) };

				result.message = 'Expecting ' + actual
					+ (result.pass === true ? ' not' : '')
					+ ' to be a float';

				return result;
			}
		}
	},
	toBeANumber: function() {
		return {
			compare: function(actual) {
				var result = { pass: isFloat(actual) };

				result.message = 'Expecting ' + actual
					+ (result.pass === true ? ' not' : '')
					+ ' to be a number';

				return result;
			}
		}
	},
	toBeAString: function() {
		return {
			compare: function(actual) {
				var result = { pass: typeof actual === 'string' };

				result.message = 'Expecting ' + actual
					+ (result.pass === true ? ' not' : '')
					+ ' to be a string';

				return result;
			}
		}
	}
};

beforeEach(function() {
	jasmine.addMatchers(typeMatchers);
});

})(jasmine);