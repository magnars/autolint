/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var fileWatcher = require('file-watcher');

var watchForLint = require('watch-for-lint');

buster.testCase("watchForLint", {
  setUp: function () {
    this.linter = { checkFile: this.stub() };
  },
  
  "should be a function": function () {
    assert.isFunction(watchForLint);
  },
  
  "should check files that change": function () {
    watchForLint(this.linter, []);
    fileWatcher.emit('change', 'file1.js');
    assert.called(this.linter.checkFile);
  },
  
  "should register filePaths with watcher": function () {
    this.stub(fileWatcher, 'register');
    watchForLint(this.linter, ['*.js']);
    assert.called(fileWatcher.register);
    assert.calledWith(fileWatcher.register, '*.js');
  }
});
