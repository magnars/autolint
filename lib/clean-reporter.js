var sys = require('sys');
var ansi = require('ansi');

exports.listenTo = function (repository) {
  repository.on('errorsFixed', function (file, errorsFixed) {
    if (file.errors.length === 0) {
      sys.puts(ansi.GREEN('\nNice! ' + file.name + ' is clean.'));
    }
  });
};