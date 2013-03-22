var fs = require("fs");

function lintOnChange(linter, file) {
  var watcher = fs.watch(file, function (event) {
    linter.checkFile(file);
    if (event === "rename") {
      watcher.close();
      lintOnChange(linter, file);
    }
  });
}

module.exports = function (repository, linter) {
  repository.on('newFile', function (file) {
    lintOnChange(linter, file.name);
  });
};