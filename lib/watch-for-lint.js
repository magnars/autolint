var fileWatcher = require('file-watcher');

module.exports = function (linter, filePaths) {
  fileWatcher.on('change', function (file) {
    linter.checkFile(file);
  });
  filePaths.forEach(function (path) {
    fileWatcher.register(path);
  });
};