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
	}
};

beforeEach(function() {
	jasmine.addMatchers(arrayMatchers);
});

})(jasmine);