var print = require('./print');

function create(repository) {
  return Object.create(this, {
    repository: { value: repository }
  });
}

function printHeader(file) {
  print.red('', 'Lint in ' + file.name + ', ' + file.errorDescription() + ':');
}

function printError(error) {
  if (error) {
    print.black('  line ' + error.line + ' char ' + error.character + ': ' + error.reason);
  } else {
    print.black('  and more ...');
  }
}

function handleLint(file) {
  printHeader(file);
  file.errors.forEach(printError);
}

function listen() {
  this.repository.on('dirty', handleLint.bind(this));
}

exports.create = create;
exports.listen = listen;
