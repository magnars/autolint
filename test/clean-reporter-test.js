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
    this.repository.getDirtyFiles = this.stub().returns([]);
    this.reporter = cleanReporter.create(this.repository);
  },
  
  "should be an object": function () {
    assert.isObject(cleanReporter);
  },
  
  "should have listen method": function () {
    assert.isFunction(cleanReporter.listen);
  },
  
  "when cleaning up a file": {
    setUp: function () {
      this.file = checkedFile.create('file1.js', []);
      this.reporter.listen();
    },
    
    "should congratulate": function () {
      this.repository.emit('errorsFixed', this.file, [{}]);
      assert.called(sys.puts);
      assert.calledWith(sys.puts, 'GREEN: \nExcellent! file1.js (and everything else) is clean.');
    },
    
    "should list other files with errors": function () {
      this.repository.getDirtyFiles = this.stub().returns([
        checkedFile.create('file1.js', [{}]),
        checkedFile.create('file2.js', [{}]),
        checkedFile.create('file3.js', [{}, {}]),
        checkedFile.create('file4.js', [{}, {}, {}])
      ]);
      this.repository.emit('errorsFixed', this.file, [{}]);
      assert.called(sys.puts);
      assert.calledWith(sys.puts, 'GREEN: \nNice! file1.js is clean. Want to clean more?');
      assert.calledWith(sys.puts, '  file2.js (1 error)\n  file3.js (2 errors)');
    }
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
