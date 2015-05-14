'use strict';

(function() {

var artMatchers = {
  toContainText: function() {
    return {
      compare: function(elem, text) {
        var originalText = elem.textPathElement.string;
        var result = { pass: originalText.indexOf(text) !== -1 };
        result.message = 'Expecting to '
          + (result.pass === true ? ' not' : '')
          + ' contain  ' + originalText;

        return result;
      }
    }
  }
};

beforeEach(function() {
  jasmine.addMatchers(artMatchers);
});

})(jasmine);