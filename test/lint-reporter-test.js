/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var sys = require('sys');
var ansi = require('ansi');

var lintReporter = require('lint-reporter');

buster.testCase("lintReporter", {
  setUp: function () {
    this.reporter = Object.create(lintReporter);
    this.repository = new EventEmitter();
    this.reporter.listenTo(this.repository);
    this.stub(sys, 'puts');
  },
  
  "should be an object": function () {
    assert.isObject(lintReporter);
  },
  
  "should have listenTo method": function () {
    assert.isFunction(lintReporter.listenTo);
  },
  
  "should print filename with number of errors": function () {
    this.repository.emit('dirty', 'file1.js', [{}, {}]);
    assert.called(sys.puts);
    assert.calledWith(sys.puts, 'RED: \nLint in file1.js, 2 errors:');
  },
  
  "should print error": function () {
    this.repository.emit('dirty', 'file1.js', [{
      line: 17,
      character: 9,
      reason: 'Bazinga!'
    }]);
    assert.calledWith(sys.puts, '  line 17 char 9: Bazinga!');
  }
  
});

ansi.RED = function (string) {
  return "RED: " + string;
};
