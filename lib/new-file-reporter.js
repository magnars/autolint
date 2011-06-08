var sys = require('sys');
var ansi = require('ansi');

function listenTo(repository) {
  repository.on('newFile', this.handleNewFile.bind(this));
}

function handleNewFile(file) {
  if (file.errors.length > 0) {
    sys.puts(ansi.RED('Found ' + file.name + ' - ' + file.errorDescription()));
  } else if (this.verbose) {
    sys.puts('Found ' + file.name + ' - clean');
  }
}

function beVerbose() {
  this.verbose = true;
}

module.exports = {
  listenTo: listenTo,
  handleNewFile: handleNewFile,
  beVerbose: beVerbose
};