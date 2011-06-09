/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var sys = require('sys');
var ansi = require('ansi');
var checkedFile = require('checked-file');

var cleanReporter = require('clean-reporter');

buster.testCase("cleanReporter", {
  setUp: function () {
    this.stub(sys, 'puts');
    this.repository = new EventEmitter();
    this.reporter = cleanReporter.create(this.repository);
  },
  
  "should be an object": function () {
    assert.isObject(cleanReporter);
  },
  
  "should have listen method": function () {
    assert.isFunction(cleanReporter.listen);
  },
  
  "should congratulate on cleaning up a file": function () {
    var file = checkedFile.create('file1.js', []);
    this.reporter.listen();
    this.repository.emit('errorsFixed', file, [{}]);
    
    assert.called(sys.puts);
    assert.calledWith(sys.puts, 'GREEN: \nNice! file1.js is clean.');
  },
  
  "should not congratulate when errors remain": function () {
    var file = checkedFile.create('file1.js', [{}]);
    this.reporter.listen();
    this.repository.emit('errorsFixed', file, [{}]);
    assert.notCalled(sys.puts);
  }
});

ansi.GREEN = function (string) {
  return "GREEN: " + string;
};
