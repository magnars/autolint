var sys = require('sys');  
var ansi = require('ansi');
var pluralize = require('pluralize');

function tooManyErrors(errors) {
  return errors[errors.length - 1] === null;
}

function printHeader(fileName, errors) {
  var numErrors = pluralize(errors.length, 'error');
  if (tooManyErrors(errors)) { 
    numErrors = 'more than ' + numErrors; 
  }
  sys.puts(ansi.RED('\nLint in ' + fileName + ', ' + numErrors + ':'));
}

function printError(error) {
  if (error) {
    sys.puts('  line ' + error.line + ' char ' + error.character + ': ' + error.reason);
  } else {
    sys.puts('  and more ...');
  }
}

function handleLint(fileName, errors) {
  printHeader(fileName, errors);
  errors.forEach(printError);
}

exports.listenTo = function (repository) {
  repository.on('dirty', handleLint.bind(this));
};