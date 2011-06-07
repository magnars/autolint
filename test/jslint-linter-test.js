/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var fs = require('fs');
var jslint = require('jslint');

var linter = require('jslint-linter');

buster.testCase("jslint-linter", {
  setUp: function () {
    this.stub(fs, 'readFile');
    fs.readFile.yields(null, 'file contents');
    this.stub(jslint, 'check');
    this.callback = this.stub();
  },
  
  "should be object": function () {
    assert.isObject(linter);
  },
  
  "should have checkFile function": function () {
    assert.isFunction(linter.checkFile);
  },
  
  "should read file": function () {
    linter.checkFile('file.js');
    assert.calledOnce(fs.readFile);
    assert.calledWith(fs.readFile, 'file.js');
  },
  
  "should check file with jslint": function () {
    linter.checkFile('file.js');
    assert.calledOnce(jslint.check);
    assert.calledWith(jslint.check, 'file contents');
  },
  
  "should return promise": function () {
    var promise = linter.checkFile('file.js');
    assert.isFunction(promise.then);
  },
  
  "if check fails": {
    setUp: function () {
      jslint.check.returns(false);
      jslint.check.errors = {a: "a"};
    },
    
    "should emit dirty event": function () {
      linter.on('dirty', this.callback);

      linter.checkFile('file.js');
      assert.calledOnce(this.callback);
      assert.calledWith(this.callback, 'file.js', {a: "a"});
    },
    
    "should emit fileChecked event": function () {
      linter.on('fileChecked', this.callback);
      
      linter.checkFile('file.js');
      assert.calledOnce(this.callback);
      assert.calledWith(this.callback, 'file.js', {a: "a"});
    },
    
    "should resolve promise": function () {
      var callback = this.stub();
      linter.checkFile('file.js').then(callback);
      assert.called(callback);
    },
    
    "should resolve promise with errors": function () {
      linter.checkFile('file.js').then(function (errors) {
        assert.equals(errors, {a: "a"});
      });
    }
  },
  
  "if check succeeds": {
    setUp: function () {
      jslint.check.returns(true);
    },
    
    "should emit clean event": function () {
      linter.on('clean', this.callback);

      linter.checkFile('file.js');
      assert.calledOnce(this.callback);
      assert.calledWith(this.callback, 'file.js');
    },
    
    "should emit fileChecked event": function () {
      linter.on('fileChecked', this.callback);
      
      linter.checkFile('file.js');
      assert.calledOnce(this.callback);
      assert.calledWith(this.callback, 'file.js', []);
    },

    "should resolve promise": function () {
      var callback = this.stub();
      linter.checkFile('file.js').then(callback);
      assert.called(callback);
    },
    
    "should resolve promise with empty array": function () {
      linter.checkFile('file.js').then(function (errors) {
        assert.equals(errors, []);
      });
    }
  }
  
});
