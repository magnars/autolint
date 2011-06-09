var _ = require('underscore');
var glob = require('glob');
var buster = require('buster');
var all = buster.promise.all;

function create(linter) {
  if (!linter) { throw new Error('linter is required'); }
  var self = Object.create(this);
  self.linter = linter;
  return self;
}

function globPath(path) {
  var promise = buster.promise.create();
  glob.glob(path, function (err, files) {
    promise.resolve(files);
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
  return _(files).reject(function (file) {
    return file.match(/(\/|^)#[^\/]+/) || file.match(/(\/|^)\.[^\/]+/);
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