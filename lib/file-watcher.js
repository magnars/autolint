var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

function watchForChanges(file, callback) {
  fs.watchFile(file, function (curr, prev) {
    if (curr.mtime.valueOf() !== prev.mtime.valueOf()) {
      callback();
    }
  });
}

function registerFile(file) {
  var self = this;
  self.watchForChanges(file, function () {
    self.emit('change', file);
  });
}

module.exports = new EventEmitter();
module.exports.registerFile = registerFile;
module.exports.watchForChanges = watchForChanges;
