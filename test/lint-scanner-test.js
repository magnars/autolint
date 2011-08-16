var buster = require('buster');
var assert = buster.assert;
var EventEmitter = require('events').EventEmitter;
var glob = require('glob');
var print = require('print');

var lintScanner = require('lint-scanner');

buster.testCase("lintScanner", {
  setUp: function () {
    this.linter = new EventEmitter();
    this.scanner = lintScanner.create(this.linter);
  },
  
  "should be an object": function () {
    assert.isObject(lintScanner);
  },
  
  "should have create method": function () {
    assert.isFunction(lintScanner.create);
  },
  
  "should complain about missing linter": function () {
    assert.exception(function () {
      lintScanner.create();
    });
  },
  
  "findAllFiles": {
    setUp: function () {
      this.stub(glob, 'glob');
    },
        
    "should use glob to find files": function () {
      this.scanner.findAllFiles(['*.js']);
      assert.calledOnce(glob.glob);
      assert.calledWith(glob.glob, '*.js');
    },

    "should find all files": function () {
      glob.glob.withArgs('lib/*.js').yields(null, ['file1.js']);
      glob.glob.withArgs('test/*.js').yields(null, ['file2.js', 'file3.js']);
      this.scanner.findAllFiles(['lib/*.js', 'test/*.js']).then(function (files) {
        assert.equals(files, ['file1.js', 'file2.js', 'file3.js']);
      });
    },
    
    "with unknown path": {
      setUp: function () {
        this.stub(print, 'red');
        this.stub(print, 'black');
        glob.glob.yields({});
      },
      
      "should print warning": function () {
        this.scanner.findAllFiles(['lib/*.js']);
        assert.called(print.red);
        assert.calledWith(print.red, "\nWarning: No files in path lib/*.js");
      },
      
      "should print explanation about ** bug": function () {
        this.scanner.findAllFiles(['lib/**/*.js']);
        assert.called(print.black);
        assert.calledWith(print.black,
          "  There's a problem with ** on some systems.", 
          "  Try using multiple paths with single stars instead.");
      }
    }
    
  },
  
  "filterExcludedFiles": {
    "should keep normal files": function () {
      var files = ['file1.js', 'lib/file2.js'];
      assert.equals(this.scanner.filterExcludedFiles(files), ['file1.js', 'lib/file2.js']);
    },
    
    "should exclude emacs autosave files (starts with hash)": function () {
      var files = ['file1.js', '#file1.js'];
      assert.equals(this.scanner.filterExcludedFiles(files), ['file1.js']);
    },
    
    "shouldn't be baffled by preceding directories": function () {
      var files = ['lib/file1.js', 'lib/#file1.js'];
      assert.equals(this.scanner.filterExcludedFiles(files), ['lib/file1.js']);
    },
    
    "should exclude emacs backup files (starts with tilde)": function () {
      var files = ['test/file1.js', 'test/~file1.js'];
      assert.equals(this.scanner.filterExcludedFiles(files), ['test/file1.js']);
    },
    
    "should exclude system files (starts with .)": function () {
      var files = ['test/file1.js', 'test/.git'];
      assert.equals(this.scanner.filterExcludedFiles(files), ['test/file1.js']);
    },
    
    "should not exclude files in parent directories (starts with ..)": function () {
      var files = ['../test/file1.js'];
      assert.equals(this.scanner.filterExcludedFiles(files), ['../test/file1.js']);
    },
    
    "should exclude files from configuration": function () {
      var scanner = lintScanner.create(this.linter, [/jquery/]);
      var files = ['file.js', 'jquery.js', 'color.jquery.js'];
      assert.equals(scanner.filterExcludedFiles(files), ['file.js']);
    }
  },
  
  "checkFiles": {
    setUp: function () {
      this.promise = buster.promise.create();
      this.linter.checkFile = this.stub().returns(this.promise);
    },
    
    "should check files with linter": function () {
      this.scanner.checkFiles(['file.js']);
      assert.calledOnce(this.linter.checkFile);
    },
    
    "should return promise": function () {
      var promise = this.scanner.checkFiles(['file.js']);
      assert.isFunction(promise.then);
    },
    
    "should resolve promise when all files are checked": function () {
      var callback = this.stub();

      this.scanner.checkFiles(['file.js']).then(callback);
      assert.notCalled(callback);
      this.promise.resolve();
      assert.called(callback);
    }
  },
  
  "scan": {
    setUp: function () {
      this.findPromise = buster.promise.create();
      this.checkPromise = buster.promise.create();
      this.stub(this.scanner, 'findAllFiles').returns(this.findPromise);
      this.stub(this.scanner, 'checkFiles').returns(this.checkPromise);
    },
    
    "should find all files": function () {
      this.scanner.scan(['*.js']);
      assert.called(this.scanner.findAllFiles);
      assert.calledWith(this.scanner.findAllFiles, ['*.js']);
    },
    
    "should check all files": function () {
      this.scanner.scan();
      this.findPromise.resolve(['file1.js', '#file1.js']);
      assert.called(this.scanner.checkFiles);
      assert.calledWith(this.scanner.checkFiles, ['file1.js']);
    },
    
    "should return promise": function () {
      assert.isFunction(this.scanner.scan().then);
    },
    
    "should resolve promise when all files checked": function () {
      var callback = this.stub();
      this.scanner.scan().then(callback);

      this.findPromise.resolve();
      this.checkPromise.resolve();
      
      assert.called(callback);
    }
  }
});
