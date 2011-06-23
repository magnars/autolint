var sys = require('sys');
var ansi = require('ansi');
var pluralize = require('pluralize');

function create(repository) {
  return Object.create(this, {
    repository: { value: repository }
  });
}

function fileWithErrorCount(file) {
  return "  " + file.name + " (" + pluralize(file.errors.length, "error") + ")";
}

function differentName(file1) {
  return function (file2) {
    return file1.name !== file2.name;
  };
}

function congratulateButMoreErrors(file, dirty) {
  var twoOthers = dirty.splice(0, 2).map(fileWithErrorCount);
  sys.puts(ansi.GREEN('\nNice! ' + file.name + ' is clean. Want to clean more?'));
  sys.puts(twoOthers.join("\n"));
}

function congratulateWithNoMoreErrors(file) {
  sys.puts(ansi.GREEN('\nExcellent! ' + file.name + ' (and everything else) is clean.'));
}

function handleErrorsFixed(file, errorsFixed) {
  if (file.errors.length === 0) {
    var dirty = this.repository.getDirtyFiles().filter(differentName(file));
    if (dirty.length === 0) {
      congratulateWithNoMoreErrors(file);
    } else {
      congratulateButMoreErrors(file, dirty);
    }
  }
}

function listen() {
  this.repository.on('errorsFixed', handleErrorsFixed.bind(this));
}

exports.create = create;
exports.listen = listen;