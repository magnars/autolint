var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var print = require('print');
var checkedFile = require('checked-file');

var summaryReporter = require('summary-reporter');

buster.testCase("summaryReporter", {
  setUp: function () {
    this.stub(print, 'red');
    this.stub(print, 'green');
    this.repository = new EventEmitter();
    this.repository.getCleanFiles = this.stub().returns([]);
    this.repository.getDirtyFiles = this.stub().returns([]);
    this.repository.files = {};
    this.reporter = summaryReporter.create(this.repository);
    this.reporter.listen();
  },
  
  "should be an object": function () {
    assert.isObject(summaryReporter);
  },
  
  "should count number of clean files": function () {
    this.repository.getCleanFiles = this.stub().returns([
      checkedFile.create('file1.js', []),
      checkedFile.create('file2.js', [])
    ]);
    assert.equals(this.reporter.numCleanFiles(), 2);
  },
  
  "should count number of dirty files": function () {
    this.repository.getDirtyFiles = this.stub().returns([
      checkedFile.create('file2.js', [{}])
    ]);
    assert.equals(this.reporter.numDirtyFiles(), 1);
  },
  
  "should count number of errors": function () {
    this.repository.getDirtyFiles = this.stub().returns([
      checkedFile.create('file1.js', [{}]),
      checkedFile.create('file2.js', [{}, {}])
    ]);
    assert.equals(this.reporter.numErrors(), 3);
  },
  
  "should create summary": function () {
    assert.equals(this.reporter.getSummary(), '0 clean files, 0 errors in 0 dirty files');
  },

  "should say 'more than' when unknown number of errors": function () {
    this.repository.getDirtyFiles = this.stub().returns([
      checkedFile.create('file1.js', [{}]),
      checkedFile.create('file2.js', [{}, {}, {}, null])
    ]);
    assert.equals(this.reporter.getSummary(), '0 clean files, more than 5 errors in 2 dirty files');
  },
  
  "should print summary without errors in green": function () {
    this.reporter.print();
    assert.calledOnce(print.green);
    assert.calledWith(print.green, '', '0 clean files, 0 errors in 0 dirty files');
  },
  
  "should print summary with errors in red": function () {
    this.repository.getDirtyFiles = this.stub().returns([
      checkedFile.create('file1.js', [{}])
    ]);
    this.reporter.print();
    assert.calledOnce(print.red);
    assert.calledWith(print.red, '', '0 clean files, 1 error in 1 dirty file');
  },
  
  "should print summary on change event": function (done) {
    this.repository.emit('change');
    process.nextTick(function () {
      assert.calledOnce(print.green);
      done();
    });
  }
});
