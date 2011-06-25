var print = require('print');

function create(repository) {
  return Object.create(this, {
    repository: { value: repository }
  });
}

function listen() {
  this.repository.on('newFile', this.handleNewFile.bind(this));
}

function handleNewFile(file) {
  if (file.errors.length > 0) {
    print.red('Found ' + file.name + ' - ' + file.errorDescription());
  } else if (this.verbose) {
    print.black('Found ' + file.name + ' - clean');
  }
}

function beVerbose() {
  this.verbose = true;
}

module.exports = {
  create: create,
  listen: listen,
  handleNewFile: handleNewFile,
  beVerbose: beVerbose
};