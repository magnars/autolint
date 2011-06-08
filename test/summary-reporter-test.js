/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var sys = require('sys');
var ansi = require('ansi');
var checkedFile = require('checked-file');

var summaryReporter = require('summary-reporter');

buster.testCase("summaryReporter", {
  setUp: function () {
    this.stub(sys, 'puts');
    this.repository = new EventEmitter();
    this.repository.files = {};
    this.reporter = Object.create(summaryReporter);
    this.reporter.listenTo(this.repository);
  },
  
  "should be an object": function () {
    assert.isObject(summaryReporter);
  },
  
  "should have listenTo method": function () {
    assert.isFunction(summaryReporter.listenTo);
  },
  
  "should count number of clean files": function () {
    this.repository.files = {
      'file1.js': checkedFile.create('file1.js', []),
      'file2.js': checkedFile.create('file2.js', []),
      'file3.js': checkedFile.create('file3.js', [{}])
    };
    assert.equals(this.reporter.numCleanFiles(), 2);
  },
  
  "should count number of dirty files": function () {
    this.repository.files = {
      'file1.js': checkedFile.create('file1.js', []),
      'file2.js': checkedFile.create('file2.js', [{}])
    };
    assert.equals(this.reporter.numDirtyFiles(), 1);
  },
  
  "should count number of errors": function () {
    this.repository.files = {
      'file1.js': checkedFile.create('file1.js', [{}]),
      'file2.js': checkedFile.create('file2.js', [{}, {}])
    };
    assert.equals(this.reporter.numErrors(), 3);
  },
  
  "should create summary": function () {
    assert.equals(this.reporter.getSummary(), "0 clean files, 0 errors in 0 dirty files");
  },

  "should say 'more than' when unknown number of errors": function () {
    this.repository.files = { 
      'file1.js': checkedFile.create('file1.js', [{}]),
      'file2.js': checkedFile.create('file2.js', [{}, {}, {}, null])
    };
    assert.equals(this.reporter.getSummary(), "0 clean files, more than 5 errors in 2 dirty files");
  },
  
  "should print summary without errors in green": function () {
    this.reporter.print();
    assert.calledOnce(sys.puts);
    assert.calledWith(sys.puts, "\nGREEN: 0 clean files, 0 errors in 0 dirty files");
  },
  
  "should print summary with errors in red": function () {
    this.repository.files = { 
      'file1.js': checkedFile.create('file1.js', [{}])
    };
    this.reporter.print();
    assert.calledOnce(sys.puts);
    assert.calledWith(sys.puts, "\nRED: 0 clean files, 1 error in 1 dirty file");
  },
  
  "should print summary on change event": function (done) {
    this.repository.emit('change');
    process.nextTick(function () {
      assert.calledOnce(sys.puts);
      done();
    });
  }
});

ansi.RED = function (string) {
  return "RED: " + string;
};

ansi.GREEN = function (string) {
  return "GREEN: " + string;
};

