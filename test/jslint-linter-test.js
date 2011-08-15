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
    this.stub(jslint, 'JSLINT').returns(true);
    this.callback = this.stub();
    this.linter = linter.create({});
  },
  
  "should be object": function () {
    assert.isObject(linter);
  },
  
  "should have checkFile function": function () {
    assert.isFunction(linter.checkFile);
  },
  
  "test should complain about missing options": function () {
    assert.exception(function () {
      linter.create();
    });
  },
  
  "should read file": function () {
    this.linter.checkFile('file.js');
    assert.calledOnce(fs.readFile);
    assert.calledWith(fs.readFile, 'file.js');
  },
  
  "should check file with jslint and options": function () {
    var options = {};
    this.linter = linter.create(options);
    this.linter.checkFile('file.js');
    assert.calledOnce(jslint.JSLINT);
    assert.calledWith(jslint.JSLINT, 'file contents', options);
  },
  
  "should return promise": function () {
    assert.isFunction(this.linter.checkFile('file.js').then);
  },
  
  "if check fails": {
    setUp: function () {
      jslint.JSLINT.returns(false);
      jslint.JSLINT.errors = [{}];
    },
    
    "should emit fileChecked event": function () {
      this.linter.on('fileChecked', this.callback);
      this.linter.checkFile('file.js');
      assert.calledOnce(this.callback);
    },
    
    "should pass file with event": function () {
      this.linter.on('fileChecked', this.callback);
      this.linter.checkFile('file.js');
      var args = this.callback.getCall(0).args;
      assert.match(args[0], {
        name: 'file.js',
        errors: [{}]
      });
    },
    
    "should resolve promise": function () {
      var callback = this.stub();
      this.linter.checkFile('file.js').then(callback);
      assert.called(callback);
    },
    
    "should resolve promise with errors": function () {
      this.linter.checkFile('file.js').then(function (errors) {
        assert.equals(errors, [{}]);
      });
    }
  },
  
  "if check succeeds": {
    setUp: function () {
      jslint.JSLINT.returns(true);
    },
    
    "should emit fileChecked event": function () {
      this.linter.on('fileChecked', this.callback);
      
      this.linter.checkFile('file.js');
      assert.calledOnce(this.callback);
    },

    "should resolve promise": function () {
      var callback = this.stub();
      this.linter.checkFile('file.js').then(callback);
      assert.called(callback);
    },
    
    "should resolve promise with empty array": function () {
      this.linter.checkFile('file.js').then(function (errors) {
        assert.equals(errors, []);
      });
    }
  }
  
});
