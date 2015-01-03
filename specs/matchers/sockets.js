'use strict';

(function() {

var socketMatchers = {
	toBeListeningTo: function() {
		return {
			compare: function(actual, channel) {
				var result = { pass: actual.isListening(channel) };
				result.message = 'Expecting socket'
					+ (result.pass === true ? ' not' : '')
					+ ' to be listening to ' + channel;

				return result;
			}
		}
	}
};

beforeEach(function() {
	jasmine.addMatchers(socketMatchers);
});

})(jasmine);