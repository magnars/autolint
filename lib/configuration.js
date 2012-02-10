var _ = require("underscore");
var path = require("path");
var defaultConfig = require("./default-configuration");

module.exports = {
  exists: function () { 
    return path.existsSync("./autolint.js");
  },

  load: function () {
    var fileConfig = require(process.cwd() + "/autolint");
    var conf = _.extend({}, defaultConfig, fileConfig);
    conf.linterOptions = _.extend({},
      defaultConfig.linterOptions, 
      fileConfig.linterOptions);
    return conf;
  }
};