var print = require('./print');
var pluralize = require('./pluralize');

function create(repository) {
  return Object.create(this, {
    repository: { value: repository }
  });
}

function shuffle(list) {
  var i, j, tempi, tempj;
  for (i = list.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    tempi = list[i];
    tempj = list[j];
    list[i] = tempj;
    list[j] = tempi;
  }
  return list;
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
  var twoOthers = shuffle(dirty).splice(0, 2).map(fileWithErrorCount);
  print.green('', 'Nice! ' + file.name + ' is clean. Want to clean more?');
  print.black(twoOthers);
}

function congratulateWithNoMoreErrors(file) {
  print.green('', 'Excellent! ' + file.name + ' (and everything else) is clean.');
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