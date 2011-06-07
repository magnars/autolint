var sys = require('sys');
var ansi = require('ansi');

function handleClean() {
  this.clean++;
}

function handleLint(file, errors) {
  this.dirty++;
  this.errors = this.errors + errors.length;
}

function listenTo(linter) {
  linter.on('clean', handleClean.bind(this));
  linter.on('dirty', handleLint.bind(this));
}

function getSummary() {
  return this.clean + " clean files, " + this.errors + " errors in " + this.dirty + " dirty files";
}

function print() {
  var text = this.getSummary();
  var colorized = this.dirty ? ansi.RED(text) : ansi.GREEN(text);
  sys.puts("\n" + colorized);
}

module.exports = {
  clean: 0,
  dirty: 0,
  errors: 0,
  listenTo: listenTo,
  getSummary: getSummary,
  print: print
};

