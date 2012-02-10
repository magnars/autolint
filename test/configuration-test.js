var buster = require("buster");
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
  }
});
