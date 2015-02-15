'use strict';

(function() {
var n_util = require('util');

var typeMatchers = {
	toBeAnInteger: function() {
		return {
			compare: function(actual) {
				var result = { pass: (typeof actual === 'number') ?
						actual == parseInt(actual) :
						actual === parseInt(actual.toString())
				};
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
				var result = { pass: actual === parseFloat(actual.toString()) };
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
				var result = { pass: actual === parseFloat(actual.toString()) };
				result.message = 'Expecting ' + actual
					+ (result.pass === true ? ' not' : '')
					+ ' to be a number';

				return result;
			}
		}
	}
};

beforeEach(function() {
	jasmine.addMatchers(typeMatchers);
});

})(jasmine);