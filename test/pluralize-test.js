var buster = require('buster');
var assert = buster.assert;

var pluralize = require('pluralize');

buster.testCase("pluralize", {
  "should not pluralize one item": function () {
    assert.equals(pluralize(1, "item"), "1 item");
  },
  
  "should pluralize several items": function () {
    assert.equals(pluralize(2, "item"), "2 items");
  }
});
