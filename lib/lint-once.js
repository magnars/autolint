var glob = require('glob');

module.exports = function (conf) {
  var linter = require('./linter').create(conf);

  var lintScanner = require('./lint-scanner').create(linter, glob, conf.excludes);
  var repository = require('./repository').create(linter);

  var lintReporter = require('./lint-reporter').create(repository);
  var summaryReporter = require('./summary-reporter').create(repository);

  repository.listen();
  lintReporter.listen();

  lintScanner.scan(conf.paths).then(function () {
    summaryReporter.print();
    if (summaryReporter.numDirtyFiles() > 0) {
      process.exit(-1);
    }
  });

};