var sys = require('sys');  
var ansi = require('ansi');

function tooManyErrors(errors) {
  return errors[errors.length - 1] === null;
}

function printHeader(file) {
  sys.puts(ansi.RED('\nLint in ' + file.name + ', ' + file.errorDescription() + ':'));
}

function printError(error) {
  if (error) {
    sys.puts('  line ' + error.line + ' char ' + error.character + ': ' + error.reason);
  } else {
    sys.puts('  and more ...');
  }
}

function handleLint(file) {
  printHeader(file);
  file.errors.forEach(printError);
}

exports.listenTo = function (repository) {
  repository.on('dirty', handleLint.bind(this));
};