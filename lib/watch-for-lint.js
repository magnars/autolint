var fileWatcher = require('file-watcher');

module.exports = function (repository, linter) {
  var watcher = Object.create(fileWatcher);

  repository.on('newFile', function (file) {
    watcher.registerFile(file);
  });
  
  watcher.on('change', function (file) {
    linter.checkFile(file);
  });
};