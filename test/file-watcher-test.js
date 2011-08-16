var buster = require("buster");
var assert = buster.assert;
var fs = require('fs');

var fileWatcher = require('../lib/file-watcher');

buster.testCase("fileWatcher", {
  setUp: function () {
    this.stub(fileWatcher, 'watchForChanges');
  },
  
  "should be an object": function () {
    assert.isObject(fileWatcher);
  },
  
  "should have registerFile function": function () {
    assert.isFunction(fileWatcher.registerFile);
  },
  
  "should watch files for changes": function () {
    fileWatcher.registerFile('file.js');
    assert.calledOnce(fileWatcher.watchForChanges);
    assert.calledWith(fileWatcher.watchForChanges, 'file.js');
  },
  
  "should emit change events": function () {
    var callback = this.stub();
    fileWatcher.on('change', callback);

    fileWatcher.registerFile('file.js');
    fileWatcher.watchForChanges.getCall(0).args[1]();
    
    assert.calledOnce(callback);
    assert.calledWith(callback, 'file.js');
  }
  
});

var now = new Date(1);
var later = new Date(2);

buster.testCase("watchForChanges", {
  setUp: function () {
    this.stub(fs, 'watchFile');
  },
  
  "should be function": function () {
    assert.isFunction(fileWatcher.watchForChanges);
  },
  
  "should use fs.watchFile": function () {
    fileWatcher.watchForChanges('file.txt');
    assert.calledWith(fs.watchFile, 'file.txt');
  },
  
  "should callback when changed": function () {
    fs.watchFile.yields({mtime: now}, {mtime: later});
    var callback = this.stub();
    fileWatcher.watchForChanges('', callback);
    assert.called(callback);
  },
  
  "should ignore when mtime is equal": function () {
    fs.watchFile.yields({mtime: now}, {mtime: now});
    var callback = this.stub();
    fileWatcher.watchForChanges('', callback);
    assert.notCalled(callback);
  }
});
