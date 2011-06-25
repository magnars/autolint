var _ = require('underscore');
var glob = require('glob');
var print = require('print');
var buster = require('buster');
var all = buster.promise.all;

function fileStartsWith(start) {
  return new RegExp("(/|^)" + start + "[^/]+$");
}

var defaultExcludes = [
  fileStartsWith('#'),
  fileStartsWith('\\.'),
  fileStartsWith('~')
];

function exists(o) {
  return !!o;
}

function create(linter, excludes) {
  if (!linter) { throw new Error('linter is required'); }
  return Object.create(this, {
    linter: { value: linter },
    excludes: { value: defaultExcludes.concat(excludes).filter(exists) }
  });
}

function handleGlobError(path) {
  print.red("\nWarning: No files in path " + path);
  if (path.match(/\*\*/)) {
    print.black("  There's a problem with ** on some systems.",
                "  Try using multiple paths with single stars instead.");
  }
}

function globPath(path) {
  var promise = buster.promise.create();
  glob.glob(path, function (err, files) {
    if (err || files.length === 0) {
      handleGlobError(path);
      promise.reject();
    } else {
      promise.resolve(files);
    }
  });
  return promise;
}

function findAllFiles(paths) {
  var promise = buster.promise.create();
  all(paths.map(globPath.bind(this))).then(function () {
    promise.resolve(_.flatten(arguments));
  });
  return promise;
}

function filterExcludedFiles(files) {
  var excludes = this.excludes;
  return _(files).reject(function (file) {
    return excludes.some(function (exclude) {
      return file.match(exclude);
    });
  });
}

function checkLint(file) {
  return this.linter.checkFile(file);
}

function checkFiles(files) {
  var promise = buster.promise.create();
  all(files.map(checkLint.bind(this))).then(function () {
    promise.resolve();
  });
  return promise;
}

function scan(paths) {
  var promise = buster.promise.create();
  var self = this;
  self.findAllFiles(paths).then(function (files) {
    files = self.filterExcludedFiles(files);
    self.checkFiles(files).then(function () {
      promise.resolve();
    });
  });
  return promise;
}

module.exports = {
  create: create,
  findAllFiles: findAllFiles,
  filterExcludedFiles: filterExcludedFiles,
  checkFiles: checkFiles,
  scan: scan
};