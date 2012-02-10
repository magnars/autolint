var buster = require("buster");

var fs = require("fs");
var util = require("util");

var configuration = require("../lib/configuration");

buster.testCase('Configuration', {
  "should check if autolint.js exists": function () {
    var path = require("path");
    this.stub(path, "existsSync").returns(true);

    assert(configuration.exists());
    assert.calledOnceWith(path.existsSync, "./autolint.js");
  },

  "should load config from autolint.js": function () {
    assert.match(configuration.load(), { linterOptions: { node: true } });
  },

  "should load config from defaults": function () {
    assert.match(configuration.load(), { linter: "jslint" });
  },

  "should overwrite defaults from autolint.js": function () {
    assert.match(configuration.load(), { linterOptions: { indent: 2 } });
  },

  "should not overwrite existing config file": function () {
    assert.exception(function () {
      configuration.createDefaultConfigFile();
    });
  },

  "should do lots of mumbo jumbo to copy the blank config file": function () {
    var oldFile = {};
    var newFile = { once: this.stub().yields() };

    this.stub(configuration, "exists").returns(false);
    this.stub(fs, "createReadStream").returns(oldFile);
    this.stub(fs, "createWriteStream").returns(newFile);
    this.stub(util, "pump");
    
    configuration.createDefaultConfigFile();

    assert.calledOnceWith(fs.createWriteStream, "./autolint.js");
    assert.calledOnce(fs.createReadStream); // jeez, __dirname for the lose
    assert.calledOnceWith(util.pump, oldFile, newFile);
  }
});
