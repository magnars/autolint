var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var EventEmitter = require('events').EventEmitter;
var glob = require('glob');
var checkedFile = require('../lib/checked-file');

var repository = require('../lib/repository');

function file(name, errors) {
  return checkedFile.create(name, errors);
}

buster.testCase("repository", {
  setUp: function () {
    this.linter = new EventEmitter();
    this.repo = repository.create(this.linter);
    this.repo.listen();
  },
  
  "should keep track of files": function () {
    var f = file('file1.js', [{}, {}]);
    this.linter.emit('fileChecked', f);
    assert.equals(this.repo.files['file1.js'], f);
  },
  
  "when getting files": {
    setUp: function () {
      this.clean = file('clean.js', []);
      this.dirty = file('dirty.js', [{}]);
      this.repo.files['clean.js'] = this.clean;
      this.repo.files['dirty.js'] = this.dirty;
    },
    
    "should get just clean files": function () {
      assert.equals(this.repo.getCleanFiles(), [this.clean]);
    },

    "should get just dirty files": function () {
      assert.equals(this.repo.getDirtyFiles(), [this.dirty]);
    }
  },
  
  "dirty event": {
    setUp: function () {
      this.callback = this.stub();
      this.repo.on('dirty', this.callback);
    },
    
    "should emit when we have errors": function () {
      var f = file('file3.js', [{}, {}, {}]);
      this.linter.emit('fileChecked', f);
      assert.called(this.callback);
      assert.calledWith(this.callback, f);
    },
    
    "should not emit without errors": function () {
      this.linter.emit('fileChecked', file('file4.js', []));
      refute.called(this.callback);
    }
  },
  
  "newFile event": {
    setUp: function () {
      this.repo.files['old-file.js'] = file('old-file.js', []);
      this.callback = this.stub();
      this.repo.on('newFile', this.callback);
    },
  
    "should not emit event for old files": function () {
      this.linter.emit('fileChecked', file('old-file.js', []));
      refute.called(this.callback);
    },
  
    "should emit event for new files": function () {
      var f = file('new-file.js', [{}]);
      this.linter.emit('fileChecked', f);
      assert.called(this.callback);
      assert.calledWith(this.callback, f);
    }
  },
  
  "errorsIntroduced event": {
    setUp: function () {
      this.oldError = {
        line: 9,
        character: 1,
        reason: 'Whatever'
      };
      this.newError = {
        line: 11,
        character: 9,
        reason: 'You screwed up, dude'
      };
      this.repo.files['file.js'] = file('file.js', [this.oldError]);
      this.callback = this.stub();
      this.repo.on('errorsIntroduced', this.callback);
    },
    
    "should emit event with new error": function () {
      var f = file('file.js', [Object.create(this.oldError), this.newError]);
      this.linter.emit('fileChecked', f);
      assert.called(this.callback);
      assert.calledWith(this.callback, f, [this.newError]);
    },
    
    "should not emit event without new errors": function () {
      this.linter.emit('fileChecked', file('file.js', [this.oldError]));
      refute.called(this.callback);
    },
    
    "should ignore null errors": function () {
      var f = file('file.js', [Object.create(this.oldError), this.newError, null]);
      this.linter.emit('fileChecked', f);
      assert.calledWith(this.callback, f, [this.newError]);
    },
    
    "should not blame for introducing errors when unknown errors exist": function () {
      this.repo.files['file.js'] = file('file.js', [this.oldError, null]);
      var f = file('file.js', [Object.create(this.oldError), this.newError]);
      this.linter.emit('fileChecked', f);
      refute.called(this.callback);
    }
  },
  
  "errorsFixed event": {
    setUp: function () {
      this.error1 = {
        line: 7,
        character: 3,
        reason: 'Bah'
      };
      this.error2 = {
        line: 3,
        character: 19,
        reason: 'Humbug'
      };
      this.repo.files['file.js'] = file('file.js', [this.error1, this.error2]);
      this.callback = this.stub();
      this.repo.on('errorsFixed', this.callback);
    },
    
    "should emit when error fixed": function () {
      var f = file('file.js', [Object.create(this.error2)]);
      this.linter.emit('fileChecked', f);
      assert.calledOnce(this.callback);
      assert.calledWith(this.callback, f, [this.error1]);
    },
    
    "should not emit when nothing fixed": function () {
      this.linter.emit('fileChecked', file('file.js', [
        Object.create(this.error1), 
        Object.create(this.error2)
      ]));
      refute.called(this.callback);
    },
    
    "should emit also when we have an unknown number of errors": function () {
      this.repo.files['file.js'] = file('file.js', [this.error1, this.error2, null]);
      var f = file('file.js', [Object.create(this.error2), null]);
      this.linter.emit('fileChecked', f);
      assert.calledOnce(this.callback);
    },
    
    "should not emit when we introduce an unknown number of errors": function () {
      var f = file('file.js', [Object.create(this.error2), null]);
      this.linter.emit('fileChecked', f);
      refute.called(this.callback);
    }
  },
  
  "change event": {
    setUp: function () {
      this.repo.files['file.js'] = file('file.js', [{}, {}]);
      this.callback = this.stub();
      this.repo.on('change', this.callback);
    },
    
    "should emit when number of errors have changed": function () {
      var f = file('file.js', [{}]);
      this.linter.emit('fileChecked', f);
      assert.called(this.callback);
      assert.calledWith(this.callback, f);
    },
    
    "should not emit when numbers are the same": function () {
      this.linter.emit('fileChecked', file('file.js', [{}, {}]));
      refute.called(this.callback);
    }
  }
});
