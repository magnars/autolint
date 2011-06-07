/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var sys = require('sys');

var verboseReporter = require('verbose-reporter');

buster.testCase("verboseReporter", {
  setUp: function () {
    this.reporter = Object.create(verboseReporter);
    this.linter = new EventEmitter();
    this.reporter.listenTo(this.linter);
    this.stub(sys, 'puts');
  },
  
  "should be an object": function () {
    assert.isObject(verboseReporter);
  },
  
  "should have listenTo method": function () {
    assert.isFunction(verboseReporter.listenTo);
  },
  
  "should print filename with number of errors": function () {
    this.linter.emit('dirty', 'file1.js', [{}, {}]);
    assert.called(sys.puts);
    assert.match(sys.puts.getCall(0).args[0], 'Lint in file1.js, 2 errors:');
  },
  
  "should print error": function () {
    this.linter.emit('dirty', 'file1.js', [{
      line: 17,
      character: 9,
      reason: 'Bazinga!'
    }]);
    assert.calledWith(sys.puts, '  line 17 char 9: Bazinga!');
  },
  
  "should store last lint": function () {
    this.linter.emit('dirty', 'file2.js', []);
    assert.equals(this.reporter.lastDirtyFile, 'file2.js');
  },
  
  "should congratulate on fixed lint": function () {
    this.reporter.lastDirtyFile = 'file1.js';
    this.linter.emit('clean', 'file1.js');
    this.linter.emit('clean', 'file1.js');
    assert.calledOnce(sys.puts);
    assert.match(sys.puts.getCall(0).args[0], 'Nice! file1.js is clean.');
  },
  
  "should ignore clean files that we don't know was dirty": function () {
    this.reporter.lastDirtyFile = 'file1.js';
    this.linter.emit('clean', 'file2.js');
    assert.notCalled(sys.puts);
  }
});
