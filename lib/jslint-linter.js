var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var busterPromise = require('buster-promise');
var checkedFile = require('checked-file');

function checkFile(promise, fileName, err, file) {
  var errors = this.linter.check(file, this.options) ? [] : this.linter.check.errors;
  this.emit('fileChecked', checkedFile.create(fileName, errors));
  promise.resolve(errors);
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
    linter: { value: { check: require('jslint-core').JSLINT } }
  });
}

module.exports = new EventEmitter();
module.exports.create = create;
module.exports.checkFile = loadAndCheckFile;