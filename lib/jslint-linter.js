var fs = require('fs');
var jslint = require('jslint');
var EventEmitter = require('events').EventEmitter;
var buster = require('buster');
var checkedFile = require('checked-file');

function checkFile(promise, fileName, err, file) {
  var errors = jslint.check(file, this.options) ? [] : jslint.check.errors;
  this.emit('fileChecked', checkedFile.create(fileName, errors));
  promise.resolve(errors);
}

function loadAndCheckFile(fileName) {
  var self = this;
  var promise = buster.promise.create();
  fs.readFile(fileName, 'utf-8', checkFile.bind(this, promise, fileName));
  return promise;
}

function create(options) {
  return Object.create(this, {
    options: { value: options }
  });
}

module.exports = new EventEmitter();
module.exports.create = create;
module.exports.checkFile = loadAndCheckFile;