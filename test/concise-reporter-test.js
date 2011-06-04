/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var sys = require('sys');

var conciseReporter = require('concise-reporter');

buster.testCase("conciseReporter", {
  setUp: function () {
    this.stub(sys, 'puts');
    this.linter = new EventEmitter();
    this.reporter = Object.create(conciseReporter);
    this.reporter.listenTo(this.linter);
  },
  
  "should be object": function () {
    assert.isObject(conciseReporter);
  },
  
  "should have listenTo method": function () {
    assert.isFunction(conciseReporter.listenTo);
  },
  
  "should print error count on lint": function () {
    this.linter.emit('lint', 'file.js', [{}]);

    assert.calledOnce(sys.puts);
    assert.match(sys.puts.getCall(0).args[0], 'file.js');
    assert.match(sys.puts.getCall(0).args[0], '1 error');
  },
  
  "should pluralize properly": function () {
    this.linter.emit('lint', 'file.js', [{}, {}, {}]);
    assert.match(sys.puts.getCall(0).args[0], '3 errors');
  }
});
