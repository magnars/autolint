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
  
  "should emit lint event if check fails": function () {
    linter.on('lint', this.callback);
    jslint.check.returns(false);
    jslint.check.errors = {};

    linter.checkFile('file.js');
    assert.calledOnce(this.callback);
    assert.calledWith(this.callback, 'file.js', jslint.check.errors);
  },
  
  "should emit clean event if check succeeds": function () {
    linter.on('clean', this.callback);
    jslint.check.returns(true);

    linter.checkFile('file.js');
    assert.calledOnce(this.callback);
    assert.calledWith(this.callback, 'file.js');
  }
});
