var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var print = require('print');
var checkedFile = require('checked-file');

var cleanReporter = require('clean-reporter');

buster.testCase("cleanReporter", {
  setUp: function () {
    this.stub(print, 'black');
    this.stub(print, 'green');
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
      assert.called(print.green);
      assert.calledWith(print.green, '', 'Excellent! file1.js (and everything else) is clean.');
    },
    
    "should list other files with errors": function () {
      this.repository.getDirtyFiles = this.stub().returns([
        checkedFile.create('file1.js', [{}]),
        checkedFile.create('file2.js', [{}]),
        checkedFile.create('file3.js', [{}, {}]),
        checkedFile.create('file4.js', [{}, {}, {}])
      ]);
      this.repository.emit('errorsFixed', this.file, [{}]);
      assert.called(print.green);
      assert.called(print.black);
      assert.calledWith(print.green, '', 'Nice! file1.js is clean. Want to clean more?');
      assert.calledWith(print.black, ['  file2.js (1 error)', '  file3.js (2 errors)']);
    }
  },
  
  "should not congratulate when errors remain": function () {
    var file = checkedFile.create('file1.js', [{}]);
    this.reporter.listen();
    this.repository.emit('errorsFixed', file, [{}]);
    assert.notCalled(print.green);
  }
});
