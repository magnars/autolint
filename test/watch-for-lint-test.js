var buster = require('buster');
var assert = buster.assert;
var fileWatcher = require('file-watcher');
var EventEmitter = require('events').EventEmitter;

var watchForLint = require('watch-for-lint');

buster.testCase("watchForLint", {
  setUp: function () {
    this.linter = { checkFile: this.stub() };
    this.stub(fileWatcher, 'registerFile');
    this.repository = new EventEmitter();
  },
  
  "should be function": function () {
    assert.isFunction(watchForLint);
  },
  
  "should register new files to be watched": function () {
    watchForLint(this.repository, this.linter);
    this.repository.emit('newFile', {name: 'file1.js'});
    assert.called(fileWatcher.registerFile);
    assert.calledWith(fileWatcher.registerFile, 'file1.js');
  },
  
  "should check changed files for lint": function () {
    watchForLint(this.repository, this.linter);
    fileWatcher.emit('change', 'file2.js');
    assert.called(this.linter.checkFile);
  }
});
