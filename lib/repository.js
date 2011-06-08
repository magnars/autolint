var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var glob = require('glob');
var buster = require('buster');
var all = buster.promise.all;

function checkForNewFile(file) {
  if (!this.files[file.name]) {
    this.emit('newFile', file);
  }
}

function checkForDirtyFile(file) {
  if (file.errors.length > 0) {
    this.emit('dirty', file);
  }
}

function checkForIntroducedErrors(file) {
  if (!this.files[file.name]) { return; }
  var oldErrors = this.files[file.name].errors;
  var newErrors = _(file.errors).subtract(oldErrors);
  if (newErrors.length > 0) {
    this.emit('errorsIntroduced', file, newErrors);
  }
}

function checkForFixedErrors(file) {
  if (!this.files[file.name]) { return; }
  var oldErrors = this.files[file.name].errors;
  var fixedErrors = _(oldErrors).subtract(file.errors);
  if (fixedErrors.length > 0) {
    this.emit('errorsFixed', file, fixedErrors);
  }
}

function checkForChanges(file) {
  if (!this.files[file.name]) { return; }
  var oldErrors = this.files[file.name].errors;
  var differentNumberOfErrors = oldErrors && oldErrors.length !== file.errors.length;
  if (differentNumberOfErrors) {
    this.emit('change', file);
  }
}

function storeFile(file) {
  this.files[file.name] = file;
}

function listenTo(linter) {
  this.linter = linter;
  linter.on('fileChecked', checkForNewFile.bind(this));
  linter.on('fileChecked', checkForDirtyFile.bind(this));
  linter.on('fileChecked', checkForIntroducedErrors.bind(this));
  linter.on('fileChecked', checkForFixedErrors.bind(this));
  linter.on('fileChecked', checkForChanges.bind(this));
  linter.on('fileChecked', storeFile.bind(this));
}

function globPath(path) {
  var promise = buster.promise.create();
  glob.glob(path, function (err, files) {
    promise.resolve(files);
  });
  return promise;
}

function scan(paths) {
  var promise = buster.promise.create();
  var self = this;
  self.findAllFiles(paths).then(function (files) {
    self.checkFiles(files).then(function () {
      promise.resolve();
    });
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

function create() {
  var self = Object.create(this);
  self.files = {};
  return self;
}

module.exports = new EventEmitter();
module.exports.create = create;
module.exports.listenTo = listenTo;
module.exports.scan = scan;
module.exports.findAllFiles = findAllFiles;
module.exports.checkFiles = checkFiles;