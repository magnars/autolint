var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var glob = require('glob');
var buster = require('buster');
var all = buster.promise.all;

function checkForNewFile(fileName, errors) {
  if (!this.files[fileName]) {
    this.emit('newFile', fileName, errors);
  }
}

function checkForDirtyFile(fileName, errors) {
  if (errors.length > 0) {
    this.emit('dirty', fileName, errors);
  }
}

function checkForIntroducedErrors(fileName, errors) {
  var oldErrors = this.files[fileName];
  var newErrors = _(errors).subtract(oldErrors);
  if (newErrors.length > 0) {
    this.emit('errorsIntroduced', fileName, newErrors);
  }
}

function checkForFixedErrors(fileName, errors) {
  var oldErrors = this.files[fileName];
  var fixedErrors = _(oldErrors).subtract(errors);
  if (fixedErrors.length > 0) {
    this.emit('errorsFixed', fileName, fixedErrors, errors);
  }
}

function checkForChanges(fileName, errors) {
  var oldErrors = this.files[fileName];
  var differentNumberOfErrors = oldErrors && oldErrors.length !== errors.length;
  if (differentNumberOfErrors) {
    this.emit('change', fileName);
  }
}

function storeFile(fileName, errors) {
  this.files[fileName] = errors || [];
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