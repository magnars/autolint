/*jslint indent: 2, onevar: false */
/*global require */

var buster = require("buster");
var assert = buster.assert;
var fs = require('fs');
var glob = require('glob');

var fileWatcher = require('file-watcher');

buster.testCase("fileWatcher", {
  setUp: function () {
    this.stub(glob, 'glob');
    this.stub(fileWatcher, 'watchForChanges');
    glob.glob.yields(null, ['file.js']);
  },
  
  "should be an object": function () {
    assert.isObject(fileWatcher);
  },
  
  "should have register function": function () {
    assert.isFunction(fileWatcher.register);
  },
  
  "should use glob to find files": function () {
    fileWatcher.register('*.js');
    assert.calledOnce(glob.glob);
    assert.calledWith(glob.glob, '*.js');
  },
  
  "should watch files for changes": function () {
    fileWatcher.register('*.js');
    assert.calledOnce(fileWatcher.watchForChanges);
    assert.calledWith(fileWatcher.watchForChanges, 'file.js');
  },
  
  "should emit change events": function () {
    var callback = this.stub();
    fileWatcher.on('change', callback);

    fileWatcher.register('*.js');
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
