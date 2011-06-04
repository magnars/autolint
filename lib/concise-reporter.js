var ansi = require('ansi');
var sys = require('sys');
var pluralize = require('pluralize');

function onLint(file, errors) {
  sys.puts(file + ": " + ansi.RED(pluralize(errors.length, "error")));
}

function listenTo(linter) {
  linter.on('lint', onLint);
}

exports.listenTo = listenTo;