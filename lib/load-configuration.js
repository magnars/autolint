var buster = require('buster');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var defaultConfig = require('default-configuration');

function loadFileConfiguration() {
  var promise = buster.promise.create();
  path.exists('autolint.json', function (exists) {
    if (exists) {
      fs.readFile('autolint.json', 'utf-8', function (err, file) {
        promise.resolve(JSON.parse(file));
      });
    } else {
      promise.resolve({});
    }
  });
  return promise;
}

function argsConfig(cliArgs) {
  var conf = {};
  if (cliArgs.length) {
    conf.paths = cliArgs;
  }
  return conf;
}

module.exports = function (cliArgs) {
  if (!cliArgs) { throw new TypeError('cliArgs is required'); }
  var promise = buster.promise.create();

  loadFileConfiguration().then(function (fileConfig) {
    var conf = _.extend({}, defaultConfig, fileConfig, argsConfig(cliArgs));
    conf.options = _.extend({}, defaultConfig.options, fileConfig.options);
    promise.resolve(conf);
  });

  return promise;
};