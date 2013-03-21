var fs = require("fs");

function lintOnChange(linter, file) {
  fs.watch(file, function (event) {
    if (event === "change") {
      linter.checkFile(file);
    }
  });
}

module.exports = function (repository, linter) {
  repository.on('newFile', function (file) {
    lintOnChange(linter, file.name);
  });
};