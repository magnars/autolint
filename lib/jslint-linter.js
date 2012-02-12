var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var busterPromise = require('buster-promise');
var checkedFile = require('./checked-file');

function check(file, fileName) {
  var errors = this.linter.check(file, this.options) ? [] : this.linter.check.errors;
  return checkedFile.create(fileName, errors);
}

function checkFile(promise, fileName, err, file) {
  var checked = check.call(this, file, fileName);
  this.emit('fileChecked', checked);
  promise.resolve(checked.errors);
}

function loadAndCheckFile(fileName) {
  var self = this;
  var promise = busterPromise.create();
  fs.readFile(fileName, 'utf-8', checkFile.bind(this, promise, fileName));
  return promise;
}

function create(options) {
  if (!options) { throw new TypeError('options is required (at least an empty object)'); }
  return Object.create(this, {
    options: { value: options },
    linter: { value: { check: require('../vendor/jslint').JSLINT } }
  });
}

module.exports = new EventEmitter();
module.exports.create = create;
module.exports.checkFile = loadAndCheckFile;
module.exports.check = check;
