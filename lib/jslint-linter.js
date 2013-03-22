var fs = require('fs');
var when = require("when");
var EventEmitter = require('events').EventEmitter;
var checkedFile = require('./checked-file');

function check(file, fileName) {
  var errors = this.linter.check(file, this.options) ? [] : this.linter.check.errors;
  return checkedFile.create(fileName, errors);
}

function checkFile(promise, fileName, err, file) {
  if (err) { return require("./print").red(err); }
  var checked = check.call(this, file, fileName);
  this.emit('fileChecked', checked);
  promise.resolve(checked.errors);
}

function loadAndCheckFile(fileName) {
  var d = when.defer();
  fs.readFile(fileName, 'utf-8', checkFile.bind(this, d, fileName));
  return d.promise;
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
