/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;

var file = require('checked-file');

buster.testCase("checkedFile", {
  "should be an object": function () {
    assert.isObject(file);
  },
  
  "should have create method": function () {
    assert.isFunction(file.create);
  },
  
  "when creating should complain about missing file name": function () {
    assert.exception(function () {
      file.create();
    });
  },
  
  "when creating should complain about missing errors array": function () {
    assert.exception(function () {
      file.create("name");
    });
  },
  
  "should expose file name": function () {
    var f = file.create('file1.js', []);
    assert.equals(f.name, 'file1.js');
  },
  
  "should expose errors": function () {
    var errors = [{}, {}];
    var f = file.create('', errors);
    assert.equals(f.errors, errors);
  },
  
  "too many errors": {
    "should look for trailing null": function () {
      var f = file.create('', [{}, {}, null]);
      assert.isTrue(f.tooManyErrors(), 'too many errors');
    },

    "should be false without trailing null": function () {
      var f = file.create('', [{}, {}]);
      assert.isFalse(f.tooManyErrors(), 'too many errors');
    }
  },
  
  "errorDescription": {
    setUp: function () {
      this.assertErrorDescription = function (errors, desc) {
        assert.equals(file.create('', errors).errorDescription(), desc);
      };
    },
    
    "should be function": function () {
      assert.isFunction(file.errorDescription);
    },
    
    "should return string describing number of errors": function () {
      this.assertErrorDescription([], '0 errors');
      this.assertErrorDescription([{}, {}], '2 errors');
    },
    
    "should pluralize properly": function () {
      this.assertErrorDescription([{}], '1 error');
    },
    
    "should state if too many errors": function () {
      this.assertErrorDescription([{}, null], 'more than 2 errors');
    }
  }
  
});
