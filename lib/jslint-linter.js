var fs = require('fs');
var jslint = require('jslint');
var EventEmitter = require('events').EventEmitter;
var buster = require('buster');

function checkFile(promise, fileName, err, file) {
  var errors;
  if (!jslint.check(file)) {
    errors = jslint.check.errors;
    this.emit('dirty', fileName, errors);
  } else {
    errors = [];
    this.emit('clean', fileName);
  }
  this.emit('fileChecked', fileName, errors);
  promise.resolve(errors);
}

function loadAndCheckFile(fileName) {
  var self = this;
  var promise = buster.promise.create();
  fs.readFile(fileName, 'utf-8', checkFile.bind(this, promise, fileName));
  return promise;
}

module.exports = new EventEmitter();
module.exports.checkFile = loadAndCheckFile;