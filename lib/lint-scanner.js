var _ = require('underscore');
var when = require("when");
var print = require('./print');

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

function create(linter, glob, excludes) {
  if (!linter) { throw new Error('linter is required'); }
  if (!glob) { throw new Error('glob is required'); }
  return Object.create(this, {
    linter: { value: linter },
    glob: { value: glob },
    excludes: { value: defaultExcludes.concat(excludes).filter(exists) }
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
  var d = when.defer();
  this.glob(path, function (err, files) {
    if (err || files.length === 0) {
      handleGlobError(path);
      d.reject();
    } else {
      d.resolve(files);
    }
  });
  return d.promise;
}

function findAllFiles(paths) {
  var d = when.defer();
  when.all(paths.map(globPath.bind(this))).then(function () {
    d.resolve(_.flatten(arguments));
  });
  return d.promise;
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

function checkNextFile(files, callback) {
  if (files.length === 0) {
    callback();
  }
  checkLint.call(this, files.pop()).then(function () {
    checkNextFile.call(this, files, callback);
  }.bind(this));
}

function checkFiles(files) {
  var d = when.defer();
  checkNextFile.call(this, files, function () {
    d.resolve();
  });
  return d.promise;
}

function scan(paths) {
  var d = when.defer();
  var self = this;
  self.findAllFiles(paths).then(function (files) {
    files = self.filterExcludedFiles(files);
    self.checkFiles(files).then(function () {
      d.resolve();
    });
  });
  return d.promise;
}

module.exports = {
  create: create,
  findAllFiles: findAllFiles,
  filterExcludedFiles: filterExcludedFiles,
  checkFiles: checkFiles,
  scan: scan
};