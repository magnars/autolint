/*jslint indent: 2, onevar: false */
/*global require */

var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var glob = require('glob');

var repository = require('repository');

buster.testCase("repository", {
  setUp: function () {
    this.linter = new EventEmitter();
    this.repo = repository.create();
    this.repo.listenTo(this.linter);
  },
  
  "should keep track of clean files": function () {
    this.linter.emit('fileChecked', 'file1.js', []);
    assert.equals(this.repo.files['file1.js'], []);
  },
  
  "should keep track of dirty files": function () {
    var errors = [{}, {}];
    this.linter.emit('fileChecked', 'file2.js', errors);
    assert.equals(this.repo.files['file2.js'], errors);
  },
  
  "dirty event": {
    setUp: function () {
      this.callback = this.stub();
      this.repo.on('dirty', this.callback);
    },
    
    "should emit when we have errors": function () {
      var errors = [{}, {}, {}];
      this.linter.emit('fileChecked', 'file3.js', errors);
      assert.called(this.callback);
      assert.calledWith(this.callback, 'file3.js', errors);
    },
    
    "should not emit without errors": function () {
      this.linter.emit('fileChecked', 'file4.js', []);
      assert.notCalled(this.callback);
    }
  },
  
  "newFile event": {
    setUp: function () {
      this.repo.files['old-file.js'] = [];
      this.callback = this.stub();
      this.repo.on('newFile', this.callback);
    },
  
    "should not emit event for old files": function () {
      this.linter.emit('fileChecked', 'old-file.js', []);
      assert.notCalled(this.callback);
    },
  
    "should emit event for new files": function () {
      var errors = [{}];
      this.linter.emit('fileChecked', 'new-file.js', errors);
      assert.called(this.callback);
      assert.calledWith(this.callback, 'new-file.js', errors);
    }
  },
  
  "errorsIntroduced event": {
    setUp: function () {
      this.oldError = 'old';
      this.newError = 'new';
      this.repo.files['file.js'] = [this.oldError];
      this.callback = this.stub();
      this.repo.on('errorsIntroduced', this.callback);
    },
    
    "should emit event with new error": function () {
      this.linter.emit('fileChecked', 'file.js', [this.oldError, this.newError]);
      assert.called(this.callback);
      assert.calledWith(this.callback, 'file.js', [this.newError]);
    },
    
    "should not emit event without new errors": function () {
      this.linter.emit('fileChecked', 'file.js', [this.oldError]);
      assert.notCalled(this.callback);
    }
  },
  
  "errorsFixed event": {
    setUp: function () {
      this.error1 = 'error1';
      this.error2 = 'error2';
      this.repo.files['file.js'] = [this.error1, this.error2];
      this.callback = this.stub();
      this.repo.on('errorsFixed', this.callback);
    },
    
    "should emit when error fixed": function () {
      this.linter.emit('fileChecked', 'file.js', [this.error2]);
      assert.calledOnce(this.callback);
      assert.calledWith(this.callback, 'file.js', [this.error1], [this.error2]);
    },
    
    "should not emit when nothing fixed": function () {
      this.linter.emit('fileChecked', 'file.js', [this.error1, this.error2]);
      assert.notCalled(this.callback);
    }
  },
  
  "change event": {
    setUp: function () {
      this.repo.files['file.js'] = [{}, {}];
      this.callback = this.stub();
      this.repo.on('change', this.callback);
    },
    
    "should emit when number of errors have changed": function () {
      this.linter.emit('fileChecked', 'file.js', [{}]);
      assert.called(this.callback);
      assert.calledWith(this.callback, 'file.js');
    },
    
    "should not emit when numbers are the same": function () {
      this.linter.emit('fileChecked', 'file.js', [{}, {}]);
      assert.notCalled(this.callback);
    }
  },
  
  "findAllFiles": {
    setUp: function () {
      this.stub(glob, 'glob');
    },
        
    "should use glob to find files": function () {
      this.repo.findAllFiles(['*.js']);
      assert.calledOnce(glob.glob);
      assert.calledWith(glob.glob, '*.js');
    },

    "should find all files": function () {
      glob.glob.withArgs('lib/*.js').yields(null, ['file1.js']);
      glob.glob.withArgs('test/*.js').yields(null, ['file2.js', 'file3.js']);
      this.repo.findAllFiles(['lib/*.js', 'test/*.js']).then(function (files) {
        assert.equals(files, ['file1.js', 'file2.js', 'file3.js']);
      });
    }
  },
  
  "checkFiles": {
    setUp: function () {
      this.promise = buster.promise.create();
      this.linter.checkFile = this.stub().returns(this.promise);
    },
    
    "should check files with linter": function () {
      this.repo.checkFiles(['file.js']);
      assert.calledOnce(this.linter.checkFile);
    },
    
    "should return promise": function () {
      var promise = this.repo.checkFiles(['file.js']);
      assert.isFunction(promise.then);
    },
    
    "should resolve promise when all files are checked": function () {
      var callback = this.stub();

      this.repo.checkFiles(['file.js']).then(callback);
      assert.notCalled(callback);
      this.promise.resolve();
      assert.called(callback);
    }
  },
  
  "scan": {
    setUp: function () {
      this.findPromise = buster.promise.create();
      this.checkPromise = buster.promise.create();
      this.stub(this.repo, 'findAllFiles').returns(this.findPromise);
      this.stub(this.repo, 'checkFiles').returns(this.checkPromise);
    },
    
    "should find all files": function () {
      this.repo.scan(['*.js']);
      assert.called(this.repo.findAllFiles);
      assert.calledWith(this.repo.findAllFiles, ['*.js']);
    },
    
    "should check all files": function () {
      this.repo.scan();
      this.findPromise.resolve(['file1.js']);
      assert.called(this.repo.checkFiles);
      assert.calledWith(this.repo.checkFiles, ['file1.js']);
    },
    
    "should return promise": function () {
      assert.isFunction(this.repo.scan().then);
    },
    
    "should resolve promise when all files checked": function () {
      var callback = this.stub();
      this.repo.scan().then(callback);

      this.findPromise.resolve();
      this.checkPromise.resolve();
      
      assert.called(callback);
    }
  }
});
