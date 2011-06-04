var fs = require('fs');
var jslint = require('jslint');
var EventEmitter = require('events').EventEmitter;

function checkFile(fileName, err, file) {
  if (!jslint.check(file)) {
    this.emit('lint', fileName, jslint.check.errors);
  } else {
    this.emit('clean', fileName);
  }
}

function loadAndCheckFile(fileName) {
  fs.readFile(fileName, 'utf-8', checkFile.bind(this, fileName));
}

module.exports = new EventEmitter();
module.exports.checkFile = loadAndCheckFile;