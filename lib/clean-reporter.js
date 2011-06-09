var sys = require('sys');
var ansi = require('ansi');

function create(repository) {
  return Object.create(this, {
    repository: { value: repository }
  });
}

function listen() {
  this.repository.on('errorsFixed', function (file, errorsFixed) {
    if (file.errors.length === 0) {
      sys.puts(ansi.GREEN('\nNice! ' + file.name + ' is clean.'));
    }
  });
}

exports.create = create;
exports.listen = listen;