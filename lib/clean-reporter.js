var sys = require('sys');
var ansi = require('ansi');

exports.listenTo = function (repository) {
  repository.on('errorsFixed', function (fileName, errorsFixed, errorsRemaining) {
    if (errorsRemaining.length === 0) {
      sys.puts(ansi.GREEN('\nNice! ' + fileName + ' is clean.'));
    }
  });
};