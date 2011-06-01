/*jslint indent: 2, onevar: false, undef: true */
/*globals module, require */

var buster = require("buster");
var assert = buster.assert;
var watchForChanges = require('watch_for_changes');
var fs = require('fs');

var now = new Date(1);
var later = new Date(2);

buster.testCase("watchForChanges", {
  setUp: function () {
    this.stub(fs, 'watchFile');
  },
  
  "should be function": function () {
    assert.isFunction(watchForChanges);
  },
  
  "should use fs.watchFile": function () {
    watchForChanges('file.txt');
    assert.calledWith(fs.watchFile, 'file.txt');
  },
  
  "should callback when changed": function () {
    fs.watchFile.yields({mtime: now}, {mtime: later});
    var callback = this.stub();
    watchForChanges('', callback);
    assert.called(callback);
  },
  
  "should ignore when mtime is equal": function () {
    fs.watchFile.yields({mtime: now}, {mtime: now});
    var callback = this.stub();
    watchForChanges('', callback);
    assert.notCalled(callback);
  }
});
