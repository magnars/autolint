var _ = require("underscore");
var fs = require("fs");
var util = require("util");
var defaultConfig = require("./default-configuration");

// for node 0.6 backwards compatibility
if (!fs.existsSync) {
  fs.existsSync = require("path").existsSync;
}

module.exports = {
  exists: function () {
    return fs.existsSync("./autolint.js") || fs.existsSync("./autolint-config.js");
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
    var fileConfig = fs.existsSync("./autolint.js") ?
          require(process.cwd() + "/autolint") :
          require(process.cwd() + "/autolint-config");
    return this.defaultsPlus(fileConfig);
  },

  createDefaultConfigFile: function () {
    if (this.exists()) {
      throw new Error("autolint.js (or autolint-config.js) already exists in " + process.cwd());
    }

    var newFile = fs.createWriteStream('./autolint.js');
    var oldFile = fs.createReadStream(__dirname + '/blank-config-file.js');

    newFile.once('open', function () {
      util.pump(oldFile, newFile);
    });
  }
};