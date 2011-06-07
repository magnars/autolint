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
}

exports.listenTo = function (repository) {
  repository.on('dirty', handleLint.bind(this));
};