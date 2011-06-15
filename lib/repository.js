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

function equals(error1, error2) {
  return error1.line === error2.line &&
         error1.character === error2.character &&
         error1.reason === error2.reason;
}

function subtract(allErrors, unwantedErrors) {
  allErrors = _.compact(allErrors);
  unwantedErrors = _.compact(unwantedErrors);
  return _(allErrors).reject(function (error) {
    return _(unwantedErrors).any(function (unwanted) {
      return equals(error, unwanted);
    });
  });
}

function checkForIntroducedErrors(file) {
  if (!this.files[file.name]) { return; }
  if (this.files[file.name].tooManyErrors()) { return; }
  var oldErrors = this.files[file.name].errors;
  var newErrors = subtract(file.errors, oldErrors);
  if (newErrors.length > 0) {
    this.emit('errorsIntroduced', file, newErrors);
  }
}

function introducedTooManyErrors(file) {
  return file.tooManyErrors() && !this.files[file.name].tooManyErrors();
}

function checkForFixedErrors(file) {
  if (!this.files[file.name]) { return; }
  if (introducedTooManyErrors.call(this, file)) { return; }
  var oldErrors = this.files[file.name].errors;
  var fixedErrors = subtract(oldErrors, file.errors);
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
