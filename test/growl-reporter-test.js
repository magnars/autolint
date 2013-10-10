var buster = require('buster');
var EventEmitter = require('events').EventEmitter;
var requireSubvert = require('require-subvert')(__dirname);

var growl, growlReporter;

buster.testCase("growlReporter", {
  setUp: function () {
    growl = this.stub();
    requireSubvert.subvert('growl', growl);
    growlReporter = requireSubvert.require('../lib/growl-reporter');
    this.repository = new EventEmitter();
    this.reporter = growlReporter.create(this.repository);
  },

  "should complain about missing repository": function () {
    assert.exception(function () {
      growlReporter.create();
    });
  },

  "should handle errorsIntroduced event": function () {
    this.stub(this.reporter, 'handleErrorsIntroduced');
    this.reporter.listen();

    this.repository.emit('errorsIntroduced');
    assert.called(this.reporter.handleErrorsIntroduced);
  },

  "should growl about introduced errors": function () {
    this.reporter.handleErrorsIntroduced({name: 'file.js'}, [{}]);

    assert.calledOnce(growl);
    var options = growl.getCall(0).args[1];
    assert.match(options.title, 'You introduced 1 lint error in file.js:');
  },

  "should growl with errors": function () {
    this.reporter.handleErrorsIntroduced({name: 'file.js'}, [{
      line: 17,
      character: 9,
      reason: 'Booyah!'
    }, {}]);

    assert.calledWith(growl, 'First error at line 17 char 9:\nBooyah!');
  },

  "should handle errorsFixed event": function () {
    this.stub(this.reporter, 'handleErrorsFixed');
    this.reporter.listen();

    this.repository.emit('errorsFixed');
    assert.called(this.reporter.handleErrorsFixed);
  },

  "should congratulate on clean file": function () {
    this.reporter.handleErrorsFixed({name: 'file.js', errors: []}, [{}]);
    assert.calledWith(growl, 'file.js is clean.');
  },

  "should list next error": function () {
    this.reporter.handleErrorsFixed({name: 'file.js', errors: [{
      line: 19,
      character: 0,
      reason: 'Bah, humbug!'
    }]}, [{}]);
    assert.calledWith(growl, 'Next error at line 19 char 0:\nBah, humbug!');
  },

  "should escape $": function () {
    this.reporter.handleErrorsFixed({name: 'file$.js', errors: []}, [{}]);
    assert.calledWith(growl, 'file\\$.js is clean.');
  }

});
