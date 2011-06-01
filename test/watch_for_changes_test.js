/*jslint indent: 2, onevar: false, undef: true */
/*globals module, require */

var buster = require("buster");
var assert = buster.assert;
var watchForChanges = require('watch_for_changes');
var fs = require('fs');

var today = 1306852705933;

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
    fs.watchFile.yields({mtime: new Date(today)}, {mtime: new Date(today + 3)});
    var changed = this.stub();

    watchForChanges('', changed);
    
    assert.called(changed);
  },
  
  "should ignore when mtime is equal": function () {
    fs.watchFile.yields({mtime: new Date(today)}, {mtime: new Date(today)});
    var changed = this.stub();

    watchForChanges('', changed);
    
    assert.notCalled(changed);
  }
});
