var watchForLint = require('watch-for-lint');
var onInterrupt = require('on-interrupt');

module.exports = function (conf) {
  var linter = require(conf.linter + '-linter').create(conf.linterOptions);

  var lintScanner = require('lint-scanner').create(linter, conf.excludes);
  var repository = require('repository').create(linter);

  var newFileReporter = require('new-file-reporter').create(repository);
  var lintReporter = require('lint-reporter').create(repository);
  var cleanReporter = require('clean-reporter').create(repository);
  var summaryReporter = require('summary-reporter').create(repository);
  var growlReporter = require('growl-reporter').create(repository);

  repository.listen();
  newFileReporter.listen();
  watchForLint(repository, linter);

  lintScanner.scan(conf.paths).then(function () {
    newFileReporter.beVerbose();
    cleanReporter.listen();
    lintReporter.listen();
    growlReporter.listen();
    summaryReporter.listen();
    summaryReporter.print();
  });

  onInterrupt("Checking all files.", function () {
    lintScanner.scan(conf.paths).then(function () {
      summaryReporter.print();
    });
  });
};