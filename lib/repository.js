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

function listen() {
  this.linter.on('fileChecked', checkForNewFile.bind(this));
  this.linter.on('fileChecked', checkForDirtyFile.bind(this));
  this.linter.on('fileChecked', checkForIntroducedErrors.bind(this));
  this.linter.on('fileChecked', checkForFixedErrors.bind(this));
  this.linter.on('fileChecked', checkForChanges.bind(this));
  this.linter.on('fileChecked', storeFile.bind(this));
}

function create(linter) {
  return Object.create(this, {
    linter: { value: linter },
    files: { value: {} }
  });
}

module.exports = new EventEmitter();
module.exports.create = create;
module.exports.listen = listen;
