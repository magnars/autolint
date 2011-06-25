/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var checkedFile = require('checked-file');
var print = require('print');

var newFileReporter = require('new-file-reporter');

buster.testCase("newFileReporter", {
  setUp: function () {
    this.repository = new EventEmitter();
    this.reporter = newFileReporter.create(this.repository);
    this.stub(print, 'red');
    this.stub(print, 'black');
  },
  
  "should have listen method": function () {
    assert.isFunction(newFileReporter.listen);
  },
  
  "should handle newFile event": function () {
    this.stub(this.reporter, 'handleNewFile');
    this.reporter.listen();
    this.repository.emit('newFile');

    assert.called(this.reporter.handleNewFile);
  },
  
  "should not print when found a clean file": function () {
    this.reporter.handleNewFile(checkedFile.create('file1.js', []));
    assert.notCalled(print.red);
    assert.notCalled(print.black);
  },
  
  "should print when found a clean file in verbose mode": function () {
    this.reporter.beVerbose();
    this.reporter.handleNewFile(checkedFile.create('file1.js', []));
    assert.called(print.black);
    assert.calledWith(print.black, 'Found file1.js - clean');
  },
  
  "should print when found a dirty file": function () {
    this.reporter.handleNewFile(checkedFile.create('file1.js', [{}, {}]));
    assert.calledWith(print.red, 'Found file1.js - 2 errors');
  }
});
