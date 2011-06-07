var sys = require('sys');
var ansi = require('ansi');

function listenTo(repository) {
  repository.on('newFile', this.handleNewFile.bind(this));
}

function handleNewFile(fileName, errors) {
  if (errors.length > 0) {
    sys.puts(ansi.RED('Found ' + fileName + ' - ' + errors.length + " errors"));
  } else if (this.verbose) {
    sys.puts('Found ' + fileName + ' - clean');
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