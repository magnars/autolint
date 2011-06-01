var fs = require('fs');

function watchForChanges(file, callback) {
  fs.watchFile(file, function (curr, prev) {
    if (curr.mtime.valueOf() != prev.mtime.valueOf()) {
      callback();
    }
  });
}

module.exports = watchForChanges;