var customEquals = [];

beforeEach(function() {
	customEquals.forEach(function(customEqual) {
		jasmine.addCustomEqualityTester(customEqual);
	});
});