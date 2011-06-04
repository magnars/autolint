var sys = require('sys');  
var ansi = require('ansi');

function printHeader(fileName, errors) {
  sys.puts(ansi.RED('\nLint in ' + fileName + ', ' + errors.length + ' errors:'));
}

function printError(error) {
  sys.puts('  line ' + error.line + ' char ' + error.character + ': ' + error.reason);
}

function handleLint(fileName, errors) {
  printHeader(fileName, errors);
  errors.forEach(printError);
  this.lastDirtyFile = fileName;
}

function handleClean(fileName) {
  if (fileName === this.lastDirtyFile) {
    sys.puts(ansi.GREEN('\nNice! ' + fileName + ' is clean.'));
    this.lastDirtyFile = null;
  }
}

exports.listenTo = function (linter) {
  linter.on('lint', handleLint.bind(this));
  linter.on('clean', handleClean.bind(this));
};