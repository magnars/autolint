var buster = require('buster');
var EventEmitter = require('events').EventEmitter;
var print = require('../lib/print');
var checkedFile = require('../lib/checked-file');

var lintReporter = require('../lib/lint-reporter');

buster.testCase("lintReporter", {
  setUp: function () {
    this.repository = new EventEmitter();
    this.reporter = lintReporter.create(this.repository);
    this.reporter.listen();
    this.stub(print, 'red');
    this.stub(print, 'black');
  },

  "should be an object": function () {
    assert.isObject(lintReporter);
  },

  "should print filename with number of errors": function () {
    var file = checkedFile.create('file1.js', [{}, {}]);
    this.repository.emit('dirty', file);
    assert.called(print.red);
    assert.calledWith(print.red, '', 'Lint in file1.js, 2 errors:');
  },

  "should print error": function () {
    var file = checkedFile.create('file1.js', [{
      line: 17,
      character: 9,
      reason: 'Bazinga!'
    }]);
    this.repository.emit('dirty', file);
    assert.calledWith(print.black, '  line 17 char 9: Bazinga!');
  }

});
