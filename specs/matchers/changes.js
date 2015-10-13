'use strict';

(function() {
	function ChangeTester(util, equalityTesters) {
		this.util = util;
		this.equalityTesters = equalityTesters;
	}

	ChangeTester.prototype = {
		compare: function(actual, expected) {
			if (typeof actual != 'function') { throw new TypeError('Actual must be a function'); }
			if (typeof expected != 'function') { throw new TypeError('Expectation must be a function'); }

			var previousValue = expected();
			actual(); // Performing the changing action
			var newValue = expected();

			var result = {};
			result.pass = this.testChange(previousValue, newValue);
			result.message = this.generateMessage(result.pass, previousValue, newValue);

			return result;
		},
		/**
		 * Tests if two values are equals (correctly for Jasmine).
		 * @param lhv left-hand value
		 * @param rhv right-hand value
		 * @return {boolean} true if the values are equal
		 */
		equal: function(lhv, rhv) {
			return this.util.equals(lhv, rhv, this.equalityTesters);
		},
		/**
		 * Decides if the value has been changed by the action.
		 * @param previousValue the value before the action
		 * @param newValue the value after the action
		 * @return {boolean} true if the value has changed
		 */
		testChange: function(previousValue, newValue) {
			return !this.equal(previousValue, newValue);
		},
		generateMessage: function(pass, fromValue, toValue) {
			if (pass === true) {
				return 'Expecting value not to change. Actual: '+ fromValue +' -> ' + toValue;
			} else {
			return 'Expecting value to change. Actual: '+ fromValue;
			}
		},
		completeMessage: function(fromValue, toValue, pass, previousValue, newValue) {
			return 'Expecting value'
					+ (pass === true ? ' not' : '' )
					+ ' to change from ' + fromValue
					+ ' to ' + toValue
					+ '. Actual ('+ previousValue +' -> ' + newValue + ')';
		},
		by: function(increment) {
			this.testChange = function(previousValue, newValue) {
				return this.equal(previousValue + increment, newValue);
			};
			this.generateMessage = function(pass, previousValue, newValue) {
				return this.completeMessage(previousValue, previousValue + increment, pass, previousValue, newValue);
			}
		},
		from: function(fromValue) {
			var matcher = this;
			matcher.testChange = function() {
				throw new Error('From value defined but not to value.');
			};

			return {
				to: function(toValue) {
					matcher.testChange = function(previousValue, newValue) {
						return this.equal(previousValue, fromValue) && this.equal(newValue, toValue);
					};
					matcher.generateMessage = matcher.completeMessage.bind(matcher, fromValue, toValue);
				}
			}
		}
	};

	var changeMatchers = {
		toChange: function(util, equalityTesters) {
			var matcher = new ChangeTester(util, equalityTesters);
			return {
				compare: function(actual, expected, byValue) {
					return matcher.compare(actual, expected);
				}
			};
		},
		toChangeBy: function(util, equalityTesters) {
			var matcher = new ChangeTester(util, equalityTesters);
			return {
				compare: function(actual, expected, byValue) {
					matcher.by(byValue);
					return matcher.compare(actual, expected);
				}
			};
		},
		toChangeFromTo: function(util, equalityTesters) {
			var matcher = new ChangeTester(util, equalityTesters);
			return {
				compare: function(actual, expected, fromValue, toValue) {
					matcher.from(fromValue).to(toValue);
					return matcher.compare(actual, expected);
				}
			};
		}
	};

	beforeEach(function() {
		jasmine.addMatchers(changeMatchers);
	});

})(jasmine);
