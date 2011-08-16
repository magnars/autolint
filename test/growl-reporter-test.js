var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var growl = require('growl');

var growlReporter = require('growl-reporter');

buster.testCase("growlReporter", {
  setUp: function () {
    this.repository = new EventEmitter();
    this.reporter = growlReporter.create(this.repository);
    this.stub(growl, 'notify');
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
    
    assert.calledOnce(growl.notify);
    var options = growl.notify.getCall(0).args[1];
    assert.match(options.title, 'You introduced 1 lint error in file.js:');
  },
  
  "should growl with errors": function () {
    this.reporter.handleErrorsIntroduced({name: 'file.js'}, [{
      line: 17,
      character: 9,
      reason: 'Booyah!'
    }, {}]);
    
    assert.calledWith(growl.notify, 'First error at line 17 char 9:\nBooyah!');
  },
  
  "should handle errorsFixed event": function () {
    this.stub(this.reporter, 'handleErrorsFixed');
    this.reporter.listen();
    
    this.repository.emit('errorsFixed');
    assert.called(this.reporter.handleErrorsFixed);
  },
  
  "should congratulate on clean file": function () {
    this.reporter.handleErrorsFixed({name: 'file.js', errors: []}, [{}]);
    assert.calledWith(growl.notify, 'file.js is clean.');
  },
  
  "should list next error": function () {
    this.reporter.handleErrorsFixed({name: 'file.js', errors: [{
      line: 19,
      character: 0,
      reason: 'Bah, humbug!'
    }]}, [{}]);
    assert.calledWith(growl.notify, 'Next error at line 19 char 0:\nBah, humbug!');
  },
  
  "should escape $": function () {
    this.reporter.handleErrorsFixed({name: 'file$.js', errors: []}, [{}]);
    assert.calledWith(growl.notify, 'file\\$.js is clean.');
  }
  
});
