/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;

var summaryReporter = require('summary-reporter');

buster.testCase("summaryReporter", {
  setUp: function () {
    this.linter = new EventEmitter();
    this.reporter = Object.create(summaryReporter);
    this.reporter.listenTo(this.linter);
  },
  
  "should be an object": function () {
    assert.isObject(summaryReporter);
  },
  
  "should have listenTo method": function () {
    assert.isFunction(summaryReporter.listenTo);
  },
  
  "should create summary": function () {
    assert.equals(this.reporter.getSummary(), "0 clean files, 0 errors in 0 dirty files");
  },
  
  "should count clean files": function () {
    this.linter.emit('clean', '');
    this.linter.emit('clean', '');
    this.linter.emit('clean', '');
    assert.equals(this.reporter.getSummary(), "3 clean files, 0 errors in 0 dirty files");
  },
  
  "should count errors in dirty files": function () {
    this.linter.emit('dirty', '', [{}]);
    this.linter.emit('dirty', '', [{}, {}]);
    assert.equals(this.reporter.getSummary(), "0 clean files, 3 errors in 2 dirty files");
  },
  
  "should print summary": function () {
    var sys = require('sys');
    this.stub(sys, 'puts');
    this.reporter.print();
    assert.calledOnce(sys.puts);
  }
});
