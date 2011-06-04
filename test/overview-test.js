/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var glob = require('glob');
var EventEmitter = require('events').EventEmitter;
var conciseReporter = require('concise-reporter');
var summaryReporter = require('summary-reporter');

var overview = require('overview');

buster.testCase("overview", {
  setUp: function () {
    this.stub(glob, 'glob');
    this.stub(conciseReporter, 'listenTo');
    this.stub(summaryReporter, 'listenTo');
    this.linter = new EventEmitter();
    this.linter.checkFile = this.stub();
  },
  
  "should be an object": function () {
    assert.isObject(overview);
  },
  
  "should have create method": function () {
    assert.isFunction(overview.create);
  },
  
  "should complain about missing linter": function () {
    assert.exception(function () {
      overview.create();
    });
  },
  
  "should listen to linter with concise reporter": function () {
    overview.create(this.linter);
    assert.calledOnce(conciseReporter.listenTo);
  },
  
  "should listen to linter with summary reporter": function () {
    overview.create(this.linter);
    assert.calledOnce(summaryReporter.listenTo);
  },
  
  "should have add method": function () {
    assert.isFunction(overview.add);
  },
  
  "when created": {
    setUp: function () {
      this.stub(summaryReporter, 'print');
      this.overview = overview.create(this.linter);
    },
    
    "should use glob to find files": function () {
      this.overview.add('*.js');
      assert.calledOnce(glob.glob);
      assert.calledWith(glob.glob, '*.js');
    },

    "should keep track of files": function () {
      glob.glob.withArgs('lib/*.js').yields(null, ['file1.js']);
      glob.glob.withArgs('test/*.js').yields(null, ['file2.js', 'file3.js']);
      this.overview.add('lib/*.js');
      this.overview.add('test/*.js');
      assert.equals(['file1.js', 'file2.js', 'file3.js'], this.overview.files);
    },
    
    "add should return promise": function () {
      var promise = this.overview.add('*.js');
      assert.isFunction(promise.then);
    },
    
    "add should resolve promise when glob is success": function () {
      var callback = this.stub();
      this.overview.add('*.js').then(callback);
      glob.glob.getCall(0).args[1](null, []);
      assert.called(callback);
    },

    "should check files when calling print": function () {
      this.overview.files = ['file1.js', 'file2.js', 'file3.js'];
      this.overview.print();

      assert.calledThrice(this.linter.checkFile);
    },

    "should call allChecked when all files checked": function () {
      this.stub(this.overview, 'allChecked');
      this.overview.files = ['file1.js', 'file2.js', 'file3.js'];
      this.overview.print();

      this.linter.emit('clean', 'file1.js');
      this.linter.emit('lint', 'file2.js');
      this.linter.emit('clean', 'file3.js');
      assert.calledOnce(this.overview.allChecked);
    },
    
    "should print summary when all checked": function () {
      this.overview.allChecked();
      assert.calledOnce(summaryReporter.print);
    }
  }
  
});

buster.testCase("show overview", {
  setUp: function () {
    this.overview = Object.create(overview);
    this.stub(this.overview, 'create').returns(this.overview);
    this.stub(this.overview, 'add');
    this.stub(this.overview, 'print');
    this.promise = buster.promise.create();
    this.overview.add.returns(this.promise);
  },
  
  "should create overview with linter": function () {
    this.linter = {};
    this.overview.show(this.linter, []);
    assert.calledOnce(this.overview.create);
    assert.calledWith(this.overview.create, this.linter);
  },
  
  "should add all file paths": function () {
    this.overview.show({}, ['lib/*.js', 'test/*.js']);
    assert.calledTwice(this.overview.add);
    assert.calledWith(this.overview.add, 'lib/*.js');
    assert.calledWith(this.overview.add, 'test/*.js');
  },
  
  "should print when all adds are complete": function () {
    this.overview.show({}, ['lib/*.js']);
    assert.notCalled(this.overview.print);
    this.promise.resolve();
    assert.calledOnce(this.overview.print);
  }
});

