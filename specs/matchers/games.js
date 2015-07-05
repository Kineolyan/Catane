'use strict';

(function() {

	var n_util = require('util');

	var gameMatchers = {
		toHaveResources: function(util, equalityTesters) {
			return {
				compare: function(actual, expectedResources) {
					var playerResources = JSON.parse(JSON.stringify(actual.resources));
					for (var res in playerResources) {
						if (playerResources[res] === 0) { delete playerResources[res]; }
					}

					var result = { pass: util.equals(playerResources, expectedResources, equalityTesters) };
					result.message = 'Expecting player resources ' + n_util.inspect(actual.resources)
							+ (result.pass === true ? ' not' : '')
							+ ' to equal ' + n_util.inspect(expectedResources);

					return result;
				}
			}
		}
	};

	beforeEach(function() {
		jasmine.addMatchers(gameMatchers);
	});

})(jasmine);