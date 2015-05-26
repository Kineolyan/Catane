'use strict';

(function() {
var n_util = require('util');

var numberMatcher = {
	toBeBetween: function(util, equalityTesters) {
		return {
			compare: function(actual, lowLimit, highLimit) {
				var result = { pass: lowLimit <= actual && actual <= highLimit };
				result.message = 'Expecting ' + actual
					+ (result.pass ? ' not' : '')
					+ ' to be in [' + lowLimit + ', ' + highLimit + ']';

				return result;
			}
		}
	},
	toBeClose: function(util, equalityTesters) {
		return {
			compare: function(actual, value, gap) {
				var result = { pass: Math.abs(actual - value) <= gap };
				result.message = 'Expecting ' + actual
					+ (result.pass ? ' not' : '')
					+ ' to equal ' + value + ' (+/- ' + gap + ')';

				return result;
			}
		}
	}
};

beforeEach(function() {
	jasmine.addMatchers(numberMatcher);
});

})(jasmine);