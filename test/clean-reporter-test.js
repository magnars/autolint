/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var sys = require('sys');
var ansi = require('ansi');

var cleanReporter = require('clean-reporter');

buster.testCase("cleanReporter", {
  setUp: function () {
    this.reporter = Object.create(cleanReporter);
    this.stub(sys, 'puts');
    this.repository = new EventEmitter();
  },
  
  "should be an object": function () {
    assert.isObject(cleanReporter);
  },
  
  "should have listenTo method": function () {
    assert.isFunction(cleanReporter.listenTo);
  },
  
  "should congratulate on cleaning up a file": function () {
    this.reporter.listenTo(this.repository);
    this.repository.emit('errorsFixed', 'file1.js', [{}], []);
    
    assert.called(sys.puts);
    assert.calledWith(sys.puts, 'GREEN: \nNice! file1.js is clean.');
  },
  
  "should not congratulate when errors remain": function () {
    this.reporter.listenTo(this.repository);
    this.repository.emit('errorsFixed', 'file1.js', [{}], [{}]);
    assert.notCalled(sys.puts);
  }
});

ansi.GREEN = function (string) {
  return "GREEN: " + string;
};
