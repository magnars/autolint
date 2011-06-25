var _print = require('print');
var pluralize = require('pluralize');

function create(repository) {
  return Object.create(this, {
    repository: { value: repository }
  });
}

function listen() {
  var print = this.print.bind(this);
  this.repository.on('change', function () {
    process.nextTick(print);
  });
}

function numCleanFiles() {
  return this.repository.getCleanFiles().length;
}

function numDirtyFiles() {
  return this.repository.getDirtyFiles().length;
}

function hasUnknownNumberOfErrors() {
  return this.repository.getDirtyFiles().some(function (file) {
    return file.tooManyErrors();
  });
}

function numErrors() {
  var files = this.repository.getDirtyFiles();
  return files.reduce(function (memo, file) { return memo + file.errors.length; }, 0);
}

function cleanFiles() {
  return pluralize(this.numCleanFiles(), "clean file");
}

function dirtyFiles() {
  return pluralize(this.numDirtyFiles(), "dirty file");
}

function errors() {
  var more = this.hasUnknownNumberOfErrors() ? 'more than ' : '';
  return more + pluralize(this.numErrors(), "error");
}

function getSummary() {
  return this.cleanFiles() + ", " + this.errors() + " in " + this.dirtyFiles();
}

function print() {
  var text = this.getSummary();
  
  if (this.numDirtyFiles() > 0) {
    _print.red('', text);
  } else {
    _print.green('', text);
  }
}

module.exports = {
  create: create,
  listen: listen,
  numCleanFiles: numCleanFiles,
  numDirtyFiles: numDirtyFiles,
  numErrors: numErrors,
  cleanFiles: cleanFiles,
  dirtyFiles: dirtyFiles,
  errors: errors,
  hasUnknownNumberOfErrors: hasUnknownNumberOfErrors,
  getSummary: getSummary,
  print: print
};

