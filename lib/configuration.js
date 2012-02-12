var _ = require("underscore");
var fs = require("fs");
var path = require("path");
var util = require("util");
var defaultConfig = require("./default-configuration");

module.exports = {
  exists: function () {
    return path.existsSync("./autolint.js");
  },

  defaultsPlus: function (config) {
    var conf = _.extend({}, defaultConfig, config);
    conf.linterOptions = _.extend({},
                                  defaultConfig.linterOptions,
                                  defaultConfig[conf.linter + "Options"],
                                  config.linterOptions,
                                  config[conf.linter + "Options"]);
    return conf;
  },

  load: function () {
    var fileConfig = require(process.cwd() + "/autolint");
    return this.defaultsPlus(fileConfig);
  },

  createDefaultConfigFile: function () {
    if (this.exists()) {
      throw new Error("autolint.js already exists in " + process.cwd());
    }

    var newFile = fs.createWriteStream('./autolint.js');
    var oldFile = fs.createReadStream(__dirname + '/blank-config-file.js');

    newFile.once('open', function () {
      util.pump(oldFile, newFile);
    });
  }
};