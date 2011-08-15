var busterPromise = require('buster-promise');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var defaultConfig = require('default-configuration');

function handleError(err) {
  if (err) {
    console.log("Problem reading autolint.json: ", err);
    process.exit(-1);
  }
}

function tryParsingFile(file) {
  try {
    return JSON.parse(file);
  } catch (e) {
    console.log("Problem parsing your autolint.json.");
    console.log("Remember it has to be valid json, with quotes around keys and all.");
    console.log("Try validating it on http://jsonlint.com/");
    process.exit(-1);
  }
}

function loadFileConfiguration() {
  var promise = busterPromise.create();
  path.exists('autolint.json', function (exists) {
    if (exists) {
      fs.readFile('autolint.json', 'utf-8', function (err, file) {
        handleError(err);
        promise.resolve(tryParsingFile(file));
      });
    } else {
      promise.resolve({});
    }
  });
  return promise;
}

function parseArgsConfig(cliArgs) {
  var conf = {};
  if (cliArgs.length) {
    conf.paths = cliArgs;
  }
  return conf;
}

function loadConfiguration(cliArgs) {
  if (!cliArgs) { throw new TypeError('cliArgs is required'); }
  var argsConfig = parseArgsConfig(cliArgs);
  var promise = busterPromise.create();

  loadFileConfiguration().then(function (fileConfig) {
    var conf = _.extend({}, defaultConfig, fileConfig, argsConfig);
    conf.linterOptions = _.extend({},
      defaultConfig.linterOptions, 
      fileConfig.linterOptions,
      argsConfig.linterOptions);
    promise.resolve(conf);
  });

  return promise;
}

module.exports = loadConfiguration;