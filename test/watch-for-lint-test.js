var buster = require('buster');
var EventEmitter = require('events').EventEmitter;
var fs = require("fs");

var watchForLint = require('../lib/watch-for-lint');

buster.testCase("watchForLint", {
  setUp: function () {
    this.linter = { checkFile: this.stub() };
    this.stub(fs, 'watch');
    this.repository = new EventEmitter();
  },

  "should register new files to be watched": function () {
    watchForLint(this.repository, this.linter);
    this.repository.emit('newFile', {name: 'file1.js'});
    assert.calledOnce(fs.watch);
    assert.calledWith(fs.watch, 'file1.js');
  },

  "should check changed files for lint": function () {
    watchForLint(this.repository, this.linter);
    fs.watch.yields('change');
    this.repository.emit('newFile', {name: 'file1.js'});
    assert.calledOnce(this.linter.checkFile);
    assert.calledWith(this.linter.checkFile, 'file1.js');
  }
});
